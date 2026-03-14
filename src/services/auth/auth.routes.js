import express from 'express';
import { usersRepository } from '#repository';
import {
  comparePassword,
  generateTokens,
  hashPassword,
  setAuthCookies,
} from '#utils';
import { validate } from '#middlewares';
import { HTTP_STATUS, ERROR_MESSAGE } from '../../common/constants/index.js';
import { signUpSchema, loginSchema } from './auth.schemas.js';

export const authRouter = express.Router();

// 회원가입
authRouter.post(
  '/signup',
  validate('body', signUpSchema),
  async (req, res, next) => {
    try {
      const { email, password, nickname } = req.body;

      // 비밀번호 해싱
      const hashedPassword = await hashPassword(password);

      // 사용자 생성
      const user = await usersRepository.createUser({
        email,
        password: hashedPassword,
        nickname,
      });

      // 토큰 생성 및 쿠키 설정
      const tokens = generateTokens(user);
      setAuthCookies(res, tokens);

      // 비밀번호 제외하고 응답
      const { password: _, ...userWithoutPassword } = user;
      res.status(HTTP_STATUS.CREATED).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  },
);

// 로그인
authRouter.post(
  '/login',
  validate('body', loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // 사용자 조회
      const user = await usersRepository.findUserByEmail(email);

      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: ERROR_MESSAGE.INVALID_CREDENTIALS,
        });
      }

      // 비밀번호 검증
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: ERROR_MESSAGE.INVALID_CREDENTIALS,
        });
      }

      // 토큰 생성 및 쿠키 설정
      const tokens = generateTokens(user);
      setAuthCookies(res, tokens);

      // 비밀번호 제외하고 응답
      const { password: _, ...userWithoutPassword } = user;
      res.status(HTTP_STATUS.OK).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  },
);
