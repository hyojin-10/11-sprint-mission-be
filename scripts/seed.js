import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { fakerKO as faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const NUM_USERS = 20;

const xs = (n) => Array.from({ length: n }, (_, i) => i + 1);
const randomInt = (min, max) => faker.number.int({ min, max });

// 데이터 생성 함수
// 유저는 추후 수정 예정
const makeUsers = async (index) => {
  const hashedPassword = await bcrypt.hash('test1234', 10);

  return {
    email: faker.internet.email(),
    nickname: `${faker.person.fullName()}${index}`, // 겹치지 않게 index 붙이기
    password: hashedPassword,
    image: faker.helpers.maybe(() => faker.image.avatar(), {
      probability: 0.5, // 50% 확률로 프로필 사진 존재
    }),
  };
};

const makeProducts = (authorId) => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: randomInt(1000, 100000),
  image: xs(randomInt(1, 3)).map(() => faker.image.url()), // 이미지 0~3개
  favoriteCount: 0,
  tags: xs(randomInt(0, 3)).map(() => faker.commerce.department()),
  authorId,
  createdAt: faker.date.past(), // 1년 이내
});

const makeArticles = (authorId) => ({
  title: faker.lorem.sentence({ min: 3, max: 6 }),
  content: faker.lorem.paragraphs(randomInt(1, 4)),
  image: xs(randomInt(0, 3)).map(() => faker.image.url()),
  likeCount: 0,
  authorId,
  createdAt: faker.date.past(),
});

const makeComments = (targetId, authorId, type, targetCreatedAt) => ({
  content: faker.lorem.sentence(),
  authorId,
  [type === 'article' ? 'articleId' : 'productId']: targetId,
  createdAt: faker.date.between({ from: targetCreatedAt, to: new Date() }), // 게시글, 상품 생성 이후 ~ 현재
});

const makeLikes = (targetId, userId, type) => ({
  userId,
  [type === 'article' ? 'articleId' : 'productId']: targetId,
});

// 기존 데이터 삭제
const resetDb = (prisma) =>
  prisma.$transaction([
    prisma.articleComment.deleteMany(),
    prisma.productComment.deleteMany(),
    prisma.articleLike.deleteMany(),
    prisma.productLike.deleteMany(),
    prisma.article.deleteMany(),
    prisma.product.deleteMany(),
    prisma.user.deleteMany(),
  ]);

// 시딩
const seedUsers = async (prisma, count) => {
  const data = await Promise.all(xs(count).map((_, i) => makeUsers(i)));
  const emails = data.map((user) => user.email); // 유저 id 부여용

  await prisma.user.createMany({ data });
  return prisma.user.findMany({
    where: { email: { in: emails } },
    select: { id: true },
  });
};

const seedArticlesWithDetails = async (prisma, users) => {
  for (const user of users) {
    const articleCount = randomInt(0, 10); // 한 사람 당 0~10 개 생성

    await Promise.all(
      xs(articleCount).map(async () => {
        const article = await prisma.article.create({
          data: makeArticles(user.id),
        });

        // 댓글 생성
        const commentCount = randomInt(0, 5); // 한 게시글 당 0~5개 생성
        if (commentCount > 0) {
          const commentDatas = xs(commentCount).map(() =>
            makeComments(
              article.id,
              faker.helpers.arrayElement(users).id, // 댓글 주인 랜덤 배정
              'article',
              article.createdAt,
            ),
          );
          await prisma.articleComment.createMany({ data: commentDatas });
        }

        // 좋아요 생성
        const likeCount = randomInt(0, users.length); // 사람 수 내에서 랜덤
        if (likeCount > 0) {
          const likingUsers = faker.helpers.arrayElements(users, likeCount); // 좋아요 주인 랜덤 배정
          const likeDatas = likingUsers.map((user) =>
            makeLikes(article.id, user.id, 'article'),
          );
          await prisma.$transaction([
            prisma.articleLike.createMany({ data: likeDatas }),
            prisma.article.update({
              where: { id: article.id },
              data: { likeCount: likeCount },
            }),
          ]);
        }
      }),
    );
  }
};

const seedProductsWithDetails = async (prisma, users) => {
  for (const user of users) {
    const productCount = randomInt(0, 10);

    await Promise.all(
      xs(productCount).map(async () => {
        const product = await prisma.product.create({
          data: makeProducts(user.id),
        });

        const commentCount = randomInt(0, 5);
        if (commentCount > 0) {
          const commentDatas = xs(commentCount).map(() =>
            makeComments(
              product.id,
              faker.helpers.arrayElement(users).id,
              'product',
              product.createdAt,
            ),
          );
          await prisma.productComment.createMany({ data: commentDatas });
        }

        const likeCount = randomInt(0, users.length);
        if (likeCount > 0) {
          const likingUsers = faker.helpers.arrayElements(users, likeCount);
          const likeDatas = likingUsers.map((user) =>
            makeLikes(product.id, user.id, 'product'),
          );
          await prisma.$transaction([
            prisma.productLike.createMany({ data: likeDatas }),
            prisma.product.update({
              where: { id: product.id },
              data: { favoriteCount: likeCount },
            }),
          ]);
        }
      }),
    );
  }
};

async function main(prisma) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('⚠️  프로덕션 환경에서는 시딩을 실행하지 않습니다');
  }

  console.log('🌱 시딩 시작...');

  await resetDb(prisma);
  console.log('✅ 기존 데이터 삭제 완료');

  const users = await seedUsers(prisma, NUM_USERS);
  console.log(`✅ ${users.length}명의 유저 생성 완료`);

  await seedArticlesWithDetails(prisma, users);
  console.log('✅ 게시글 생성 완료');

  await seedProductsWithDetails(prisma, users);
  console.log('✅ 상품 생성 완료');

  console.log('✅ 데이터 시딩 완료');
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

main(prisma)
  .catch((error) => {
    console.error('❌ 시딩 에러:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
