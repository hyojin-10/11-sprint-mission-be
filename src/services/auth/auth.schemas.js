import { z } from 'zod';
import { ERROR_MESSAGE } from '../../common/constants/index.js';

// 회원가입 스키마
export const signUpSchema = z.object({
  email: z.email(ERROR_MESSAGE.INVALID_EMAIL),
  password: z
    .string(ERROR_MESSAGE.PASSWORD_REQUIRED)
    .min(8, ERROR_MESSAGE.PASSWORD_MIN),
  nickname: z
    .string(ERROR_MESSAGE.NICKNAME_REQUIRED)
    .min(2, ERROR_MESSAGE.NICKNAME_MIN),
});

// 로그인 스키마
export const loginSchema = z.object({
  email: z.email(ERROR_MESSAGE.INVALID_EMAIL),
  password: z.string().min(1, ERROR_MESSAGE.PASSWORD_REQUIRED),
});
