import { prisma } from '#db/prisma.js';
import { PRODUCT_BEST, PRODUCT_PAGELIMIT } from '#constants';

// 상품 생성
function createProduct(data) {
  const { image, ...rest } = data;
  const imageList = image ?? [];

  return prisma.product.create({
    data: {
      ...rest,
      image: imageList,
    },
  });
}

// 상품 상세 조회
function findProductById(id) {
  return prisma.product.findUnique({
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

// 상품 목록 조회 (+ 검색어, 페이지네이션)
async function findAllProducts({
  page = 1,
  limit = PRODUCT_PAGELIMIT,
  keyword,
  sort = 'latest',
}) {
  const skip = (page - 1) * limit;

  const filter = keyword?.trim()
    ? {
        OR: [
          { name: { contains: keyword.trim(), mode: 'insensitive' } },
          { description: { contains: keyword.trim(), mode: 'insensitive' } },
        ],
      }
    : {};

  const orderBy =
    sort === 'likes' ? { likes: { _count: 'desc' } } : { createdAt: 'desc' };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
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
    prisma.product.count({ where: filter }),
  ]);

  return {
    products,
    pagination: {
      currentPage: page,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page < Math.ceil(totalCount / limit),
      hasPrev: page > 1,
    },
  };
}

// 인기 상품 조회
async function findBestProducts(limit = PRODUCT_BEST) {
  return await prisma.product.findMany({
    take: limit,
    orderBy: {
      likes: {
        _count: 'desc',
      },
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

// 상품 수정
function updateProduct(id, data) {
  const { image, ...rest } = data;

  const updateData = { ...rest };
  if (image !== undefined) {
    updateData.image = Array.isArray(image) ? image : image ? [image] : [];
  }

  return prisma.product.update({
    where: { id: Number(id) },
    data: updateData,
  });
}

// 상품 삭제 (+ 댓글, 좋아요)
function deleteProduct(productId) {
  const id = Number(productId);

  return prisma.product.delete({
    where: { id },
  });
}

export const productsRepository = {
  createProduct,
  findProductById,
  findAllProducts,
  findBestProducts,
  updateProduct,
  deleteProduct,
};
