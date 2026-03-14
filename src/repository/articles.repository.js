import { prisma } from '#db/prisma.js';
import { ARTICLE_BEST, ARTICLE_PAGELIMIT } from '../common/constants/index.js';

// 게시글 생성
function createArticle(data) {
  const { image, ...rest } = data;
  const imageList = image ?? [];

  return prisma.article.create({
    data: {
      ...rest,
      image: imageList,
    },
  });
}

// 게시글 상세 조회
function findArticleById(id) {
  return prisma.article.findUnique({
    where: { id: Number(id) },
    include: {
      author: {
        select: {
          nickname: true,
          image: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
}

// 게시글 목록 조회 (+ 검색어, 페이지네이션)
async function findAllArticles({
  page = 1,
  limit = ARTICLE_PAGELIMIT,
  keyword,
  sort = 'latest',
}) {
  const skip = (page - 1) * limit;

  const filter = keyword?.trim()
    ? {
        OR: [
          { title: { contains: keyword.trim(), mode: 'insensitive' } },
          { content: { contains: keyword.trim(), mode: 'insensitive' } },
        ],
      }
    : {};

  const orderBy =
    sort === 'likes' ? { likes: { _count: 'desc' } } : { createdAt: 'desc' };

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy,
      include: {
        author: {
          select: {
            nickname: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    }),
    prisma.article.count({ where: filter }),
  ]);

  return {
    articles,
    pagination: {
      currentPage: page,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page < Math.ceil(totalCount / limit),
      hasPrev: page > 1,
    },
  };
}

// 인기 게시글 조회
async function findBestArticles(limit = ARTICLE_BEST) {
  return await prisma.article.findMany({
    take: limit,
    orderBy: {
      likes: {
        _count: 'desc',
      },
    },
    include: {
      author: {
        select: {
          nickname: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
}

// 게시글 수정
function updateArticle(id, data) {
  const { image, ...rest } = data;

  const updateData = { ...rest };
  if (image !== undefined) {
    // 배열이면 그대로, 배열 아니면 배열로, 없으면 빈 배열
    updateData.image = Array.isArray(image) ? image : image ? [image] : [];
  }

  return prisma.article.update({
    where: { id: Number(id) },
    data: updateData,
  });
}

// 게시글 삭제 (+ 댓글, 좋아요)
function deleteArticle(articleId) {
  const id = Number(articleId);

  return prisma.article.delete({
    where: { id },
  });
}

export const articlesRepository = {
  createArticle,
  findArticleById,
  findAllArticles,
  findBestArticles,
  updateArticle,
  deleteArticle,
};
