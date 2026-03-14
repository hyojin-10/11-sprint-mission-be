import { ERROR_MESSAGE } from '../../common/constants/index.js';
import { z } from 'zod';

// ID 파라미터 검증 스키마
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// 사용자 생성 스키마
export const createUserSchema = z.object({
  email: z.email(ERROR_MESSAGE.INVALID_EMAIL),
  password: z.string().min(8, ERROR_MESSAGE.PASSWORD_MIN),
  nickname: z.string().min(2, ERROR_MESSAGE.NICKNAME_MIN),
});

// 사용자 수정 스키마
export const updateUserSchema = z.object({
  email: z.email(ERROR_MESSAGE.INVALID_EMAIL).optional(),
  nickname: z.string().min(2, ERROR_MESSAGE.NICKNAME_MIN).optional(),
});
