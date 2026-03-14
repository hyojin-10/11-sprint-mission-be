import { PRODUCT_BEST, PRODUCT_PAGELIMIT } from '#constants';

export class ProductRepository {
  #prisma;

  constructor({ prisma }) {
    this.#prisma = prisma;
  }

  async findAll({
    page = 1,
    limit = PRODUCT_PAGELIMIT,
    keyword,
    sort = 'latest',
  }) {
    const skip = (page - 1) * limit;

    const searchKeyword = keyword?.trim();
    const filter = searchKeyword
      ? {
          OR: [
            { name: { contains: searchKeyword, mode: 'insensitive' } },
            { description: { contains: searchKeyword, mode: 'insensitive' } },
          ],
        }
      : {};

    const orderBy =
      sort === 'likes' ? { favoriteCount: 'desc' } : { createdAt: 'desc' };

    const [products, totalCount] = await Promise.all([
      this.#prisma.product.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      }),
      this.#prisma.product.count({
        where: filter,
      }),
    ]);

    return {
      products,
      totalCount,
    };
  }

  findBest(limit = PRODUCT_BEST) {
    return this.#prisma.product.findMany({
      take: limit,
      orderBy: {
        favoriteCount: 'desc',
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
  }

  findById(id) {
    return this.#prisma.product.findUnique({
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

    return this.#prisma.product.create({
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

    return this.#prisma.product.update({
      where: { id: Number(id) },
      data: updateData,
    });
  }

  delete(id) {
    return this.#prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
