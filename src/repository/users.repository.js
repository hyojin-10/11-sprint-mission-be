export class UserRepository {
  #prisma;

  constructor({ prisma }) {
    this.#prisma = prisma;
  }

  findAll() {
    return this.#prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
      },
    });
  }

  findById(id) {
    return this.#prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
      },
    });
  }

  findByEmail(email) {
    return this.#prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
      },
    });
  }

  findAuthByEmail(email) {
    return this.#prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        password: true,
        createdAt: true,
      },
    });
  }

  create(data) {
    return this.#prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
      },
    });
  }

  update(id, data) {
    return this.#prisma.user.update({
      where: {
        id: Number(id),
      },
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
      },
    });
  }

  delete(id) {
    return this.#prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
