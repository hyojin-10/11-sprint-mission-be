export class LikeRepository {
  #prisma;

  constructor({ prisma }) {
    this.#prisma = prisma;
  }

  #getTargetModel(type) {
    const isArticle = type === 'article';

    return {
      model: isArticle ? 'articleLike' : 'productLike',
      target: isArticle ? 'article' : 'product',
      idField: isArticle ? 'articleId' : 'productId',
      countField: isArticle ? 'likeCount' : 'favoriteCount',
      identifier: isArticle ? 'articleId_userId' : 'productId_userId',
    };
  }

  check(type, targetId, userId) {
    const { model, idField, identifier } = this.#getTargetModel(type);

    return model.findUnique({
      where: {
        [identifier]: {
          [idField]: Number(targetId),
          userId: Number(userId),
        },
      },
    });
  }

  add(type, targetId, userId) {
    const { model, target, idField, countField } = this.#getTargetModel(type);

    return this.#prisma.$transaction(async (tx) => {
      await tx[model].create({
        data: {
          [idField]: Number(targetId),
          userId: Number(userId),
        },
      });
      await tx[target].update({
        where: {
          id: Number(targetId),
        },
        data: {
          [countField]: {
            increment: 1,
          },
        },
      });
    });
  }

  remove(type, targetId, userId) {
    const { model, target, idField, countField, identifier } =
      this.#getTargetModel(type);

    return this.#prisma.$transaction(async (tx) => {
      await tx[model].delete({
        where: {
          [identifier]: {
            [idField]: Number(targetId),
            userId: Number(userId),
          },
        },
      });
      await tx[target].update({
        where: {
          id: Number(targetId),
        },
        data: {
          [countField]: {
            decrement: 1,
          },
        },
      });
    });
  }
}
