import { ERROR_MESSAGE } from '../../common/constants/index.js';
import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(1, ERROR_MESSAGE.TITLE_REQUIRED)
    .max(100, ERROR_MESSAGE.TITLE_MAX),
  content: z.string().min(1, ERROR_MESSAGE.CONTENT_REQUIRED),
  image: z
    .array(z.string())
    .max(3, ERROR_MESSAGE.IMAGE_MAX_COUNT)
    .optional()
    .default([]),
});

export const updateArticleSchema = createArticleSchema.partial();
