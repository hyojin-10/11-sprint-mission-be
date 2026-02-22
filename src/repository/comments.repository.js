import { prisma } from '#db/prisma.js';

const getTargetModel = (type) => {
  const isArticle = type === 'article';

  return {
    model: isArticle ? prisma.articleComment : prisma.productComment,
    idField: isArticle ? 'articleId' : 'productId',
  };
};

// 댓글 목록 조회
function findCommentsByTargetId(type, targetId) {
  const { model, idField } = getTargetModel(type);

  return model.findMany({
    where: {
      [idField]: Number(targetId),
    },
    orderBy: { createdAt: 'asc' },
    include: {
      author: {
        select: {
          nickname: true,
          image: true,
        },
      },
    },
  });
}

// 댓글 생성
function createComment(type, data) {
  const { model } = getTargetModel(type);

  return model.create({
    data,
    include: {
      author: {
        select: {
          nickname: true,
          image: true,
        },
      },
    },
  });
}

// 권한 체크용 댓글 하나
function findCommentById(type, id) {
  const { model } = getTargetModel(type);

  return model.findUnique({
    where: { id: Number(id) },
  });
}

// 댓글 수정
function updateComment(type, id, data) {
  const { model } = getTargetModel(type);

  return model.update({
    where: { id: Number(id) },
    data,
  });
}

// 댓글 삭제
function deleteComment(type, id) {
  const { model } = getTargetModel(type);
  return model.delete({
    where: { id: Number(id) },
  });
}

export const commentsRepository = {
  findCommentsByTargetId,
  createComment,
  findCommentById,
  updateComment,
  deleteComment,
};
