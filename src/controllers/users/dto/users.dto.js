import { ERROR_MESSAGE } from '#constants';
import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.email(ERROR_MESSAGE.INVALID_EMAIL).optional(),
  nickname: z.string().min(2, ERROR_MESSAGE.NICKNAME_MIN).optional(),
});
