export class CommentRepository {
  #prisma;

  constructor({ prisma }) {
    this.#prisma = prisma;
  }

  #getTargetModel(type) {
    const isArticle = type === 'article';

    return {
      model: isArticle
        ? this.#prisma.articleComment
        : this.#prisma.productComment,
      idField: isArticle ? 'articleId' : 'productId',
    };
  }

  findByTargetId(type, targetId) {
    const { model, idField } = this.#getTargetModel(type);

    return model.findMany({
      where: {
        [idField]: Number(targetId),
      },
      orderBy: {
        createdAt: 'asc',
      },
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

  findById(type, id) {
    const { model } = this.#getTargetModel(type);

    return model.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  create(type, data) {
    const { model } = this.#getTargetModel(type);

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

  update(type, id, data) {
    const { model } = this.#getTargetModel(type);

    return model.update({
      where: {
        id: Number(id),
      },
      data,
    });
  }

  delete(type, id) {
    const { model } = this.#getTargetModel(type);

    return model.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
