import { ERROR_MESSAGE } from '#constants';
import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.email(ERROR_MESSAGE.INVALID_EMAIL),
  password: z
    .string(ERROR_MESSAGE.PASSWORD_REQUIRED)
    .min(8, ERROR_MESSAGE.PASSWORD_MIN),
  nickname: z
    .string(ERROR_MESSAGE.NICKNAME_REQUIRED)
    .min(2, ERROR_MESSAGE.NICKNAME_MIN),
});

export const loginSchema = z.object({
  email: z.email(ERROR_MESSAGE.INVALID_EMAIL),
  password: z.string().min(1, ERROR_MESSAGE.PASSWORD_REQUIRED),
});
