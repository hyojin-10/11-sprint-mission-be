import { ERROR_MESSAGE } from '#constants';
import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createProductSchema = z.object({
  name: z
    .string(ERROR_MESSAGE.PRODUCT_NAME_REQUIRED)
    .min(1, ERROR_MESSAGE.PRODUCT_NAME_REQUIRED)
    .max(10, ERROR_MESSAGE.PRODUCT_NAME_MAX),
  description: z
    .string(ERROR_MESSAGE.DESCRIPTION_REQUIRED)
    .min(10, ERROR_MESSAGE.DESCRIPTION_MIN),
  price: z.coerce
    .number(ERROR_MESSAGE.PRICE_REQUIRED)
    .min(0, ERROR_MESSAGE.PRICE_MIN),
  image: z
    .array(z.string())
    .max(3, ERROR_MESSAGE.IMAGE_MAX_COUNT)
    .optional()
    .default([]),
  tags: z
    .array(z.string().max(5, ERROR_MESSAGE.TAG_MAX))
    .optional()
    .default([]),
});

export const updateProductSchema = createProductSchema.partial();
