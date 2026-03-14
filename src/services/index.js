import { HTTP_STATUS } from '../common/constants/index.js';
import express from 'express';
import { userRouter } from './users/index.js';
import { articleRouter } from './articles/index.js';
import { productRouter } from './products/index.js';
import { commentRouter } from './comments/index.js';
import { authRouter } from './auth/index.js';

export const router = express.Router();

router.get('/', (req, res) => {
  res
    .status(HTTP_STATUS.OK)
    .send({ now: new Date().toISOString(), message: 'OK' });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);

router.use('/articles', articleRouter);
router.use('/products', productRouter);

router.use('/comments', commentRouter);
