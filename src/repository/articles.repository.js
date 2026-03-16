import { ARTICLE_BEST, ARTICLE_PAGELIMIT } from '#constants';

export class ArticleRepository {
  #prisma;

  constructor({ prisma }) {
    this.#prisma = prisma;
  }

  async findAll({
    page = 1,
    limit = ARTICLE_PAGELIMIT,
    keyword,
    sort = 'latest',
  }) {
    const skip = (page - 1) * limit;

    const searchKeyword = keyword?.trim();
    const filter = searchKeyword
      ? {
          OR: [
            { title: { contains: searchKeyword, mode: 'insensitive' } },
            { content: { contains: searchKeyword, mode: 'insensitive' } },
          ],
        }
      : {};

    const orderBy =
      sort === 'likes' ? { likeCount: 'desc' } : { createdAt: 'desc' };

    const [articles, totalCount] = await Promise.all([
      this.#prisma.article.findMany({
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
      this.#prisma.article.count({
        where: filter,
      }),
    ]);

    return {
      articles,
      totalCount,
    };
  }

  findBest(limit = ARTICLE_BEST) {
    return this.#prisma.article.findMany({
      take: limit,
      orderBy: {
        likeCount: 'desc',
      },
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

  findById(id) {
    return this.#prisma.article.findUnique({
      where: {
        id: Number(id),
      },
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

  create(data) {
    const { image, ...rest } = data;

    return this.#prisma.article.create({
      data: {
        ...rest,
        image: image ?? [],
      },
    });
  }

  update(id, data) {
    const { image, ...rest } = data;
    const updateData = { ...rest };
    if (image !== undefined) {
      const imageArray = Array.isArray(image) ? image : [image]; // 배열 만들기
      updateData.image = imageArray.filter(Boolean); // 빈 값 제거
    }

    return this.#prisma.article.update({
      where: { id: Number(id) },
      data: updateData,
    });
  }

  delete(id) {
    return this.#prisma.article.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
