import { prisma } from '#db/prisma.js';

const getTargetModel = (type) => {
  const isArticle = type === 'article';

  return {
    model: isArticle ? prisma.articleLike : prisma.productLike,
    idField: isArticle ? 'articleId' : 'productId',
    identifier: isArticle ? 'articleId_userId' : 'productId_userId'
  };
};

// 좋아요 상태 확인
function findLike(type, targetId, userId) {
  const { model, idField, identifier } = getTargetModel(type);

  return model.findUnique({
    where: {
      [identifier]: {
        [idField]: Number(targetId), // 게시글, 상품 id
        userId: Number(userId), // 유저 id
      },
    },
  });
}

// 좋아요 추가
function addLike(type, targetId, userId) {
  const { model, idField } = getTargetModel(type);

  return model.create({
    data: {
      [idField]: Number(targetId),
      userId: Number(userId),
    },
  });
}

// 좋아요 취소
function removeLike(type, targetId, userId) {
  const { model, idField, identifier } = getTargetModel(type);
  
  return model.delete({
    where: {
      [identifier]: {
        [idField]: Number(targetId),
        userId: Number(userId),
      },
    },
  });
}

export const likesRepository = {
  findLike,
  addLike,
  removeLike,
};
