import { ERROR_MESSAGE } from '#constants';
import { z } from 'zod';

export const commentParamSchema = z.object({
  id: z.coerce.number().int().positive(),
  type: z.enum(['article', 'product']),
});

export const commentListParamSchema = z.object({
  targetId: z.coerce.number().int().positive(),
  type: z.enum(['article', 'product']),
});

export const commentSchema = z.object({
  content: z.string().min(1, ERROR_MESSAGE.COMMENT_CONTENT_REQUIRED),
});
