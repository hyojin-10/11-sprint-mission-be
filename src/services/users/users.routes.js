import express from 'express';
import bcrypt from 'bcrypt';
import { usersRepository } from '#repository';
import { ERROR_MESSAGE, HTTP_STATUS } from '../../common/constants/index.js';
import { authMiddleware, validate } from '#middlewares';
import { ForbiddenException, NotFoundException } from '#exceptions';
import {
  createUserSchema,
  idParamSchema,
  updateUserSchema,
} from './users.schema.js';

export const usersRouter = express.Router();

// 사용자 생성: POST (/api/users)
usersRouter.post(
  '/',
  validate('body', createUserSchema),
  async (req, res, next) => {
    try {
      const { email, password, nickname } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await usersRepository.createUser({
        email,
        password: hashedPassword,
        nickname,
      });

      const { password: _, ...userWithoutPassword } = newUser;

      res.status(HTTP_STATUS.CREATED).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  },
);

// 모든 유저 조회: GET (/api/users)
usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await usersRepository.findAllUsers();

    const usersWithoutPassword = users.map((user) => {
      const { password: _, ...rest } = user;
      return rest;
    });

    res.status(HTTP_STATUS.OK).json(usersWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// 특정 유저 조회: GET (/api/users/:id)
usersRouter.get(
  '/:id',
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await usersRepository.findUserById(id);

      if (!user) {
        throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
      }
      const { password: _, ...userWithoutPassword } = user;

      res.status(HTTP_STATUS.OK).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  },
);

// 유저 정보 수정: PATCH (/api/users/:id)
usersRouter.patch(
  '/:id',
  authMiddleware,
  validate('params', idParamSchema),
  validate('body', updateUserSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (req.user.id !== Number(id)) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
      }

      const existingUser = await usersRepository.findUserById(id);
      if (!existingUser) {
        throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
      }

      const updatedUser = await usersRepository.updateUser(id, updateData);

      const { password: _, ...userWithoutPassword } = updatedUser;

      res.status(HTTP_STATUS.OK).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  },
);

// 유저 삭제: DELETE (/api/users/:id)
usersRouter.delete(
  '/:id',
  authMiddleware,
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      if (req.user.id !== Number(id)) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
      }

      const existingUser = await usersRepository.findUserById(id);
      if (!existingUser) {
        throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
      }

      await usersRepository.deleteUser(id);

      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);
