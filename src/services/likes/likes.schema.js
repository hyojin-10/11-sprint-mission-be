import { z } from 'zod';

export const likeSchema = z.object({
  type: z.enum(['article', 'product'], {
    errorMap: () => ({ message: '유효하지 않은 타입입니다.' }),
  }),
  targetId: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: '올바른 대상 ID가 필요합니다.' }),
  ),
});
