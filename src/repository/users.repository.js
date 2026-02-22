import { prisma } from '#db/prisma.js';

// 유저 생성
function createUser(data) {
  return prisma.user.create({
    data,
  });
}

// 유저 조회
function findUserById(id) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
  });
}

// 유저 목록 조회
function findAllUsers() {
  return prisma.user.findMany();
}

// 유저 정보 업데이트
function updateUser(id, data) {
  return prisma.user.update({
    where: { id: Number(id) },
    data,
  });
}

// 유저 삭제
function deleteUser(id) {
  return prisma.user.delete({
    where: { id: Number(id) },
  });
}

export const usersRepository = {
  createUser,
  findUserById,
  findAllUsers,
  updateUser,
  deleteUser,
};
