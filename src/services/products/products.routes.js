import express from 'express';
import {
  commentsRepository,
  likesRepository,
  productsRepository,
} from '#repository';
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  PRODUCT_PAGELIMIT,
} from '../../common/constants/index.js';
import { authMiddleware, validate } from '#middlewares';
import { ForbiddenException, NotFoundException } from '#exceptions';
import {
  createProductSchema,
  idParamSchema,
  updateProductSchema,
} from './products.schema.js';
import { commentSchema } from '../comments/comments.schema.js';

export const productsRouter = express.Router();

// 상품 등록: POST (/api/products)
productsRouter.post(
  '/',
  authMiddleware,
  validate('body', createProductSchema),
  async (req, res, next) => {
    try {
      const { name, description, price, tags, image } = req.body;
      const authorId = req.user.id;

      const newProduct = await productsRepository.createProduct({
        name,
        description,
        price,
        tags,
        image,
        authorId,
      });

      res.status(HTTP_STATUS.CREATED).json(newProduct);
    } catch (error) {
      next(error);
    }
  },
);

// 상품 목록 조회: GET (/api/products)
productsRouter.get('/', async (req, res, next) => {
  try {
    const { page, limit, keyword, sort } = req.query;
    const result = await productsRepository.findAllProducts({
      page: Number(page) || 1,
      limit: Number(limit) || PRODUCT_PAGELIMIT,
      keyword,
      sort,
    });

    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
});

// 인기 상품 조회: GET (/api/products/best)
productsRouter.get('/best', async (req, res, next) => {
  try {
    const bestProducts = await productsRepository.findBestProducts();
    res.status(HTTP_STATUS.OK).json(bestProducts);
  } catch (error) {
    next(error);
  }
});

// 상품 상세 조회: GET (/api/products/:id)
productsRouter.get(
  '/:id',
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await productsRepository.findProductById(id);

      if (!product) {
        throw new NotFoundException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
      }

      res.status(HTTP_STATUS.OK).json(product);
    } catch (error) {
      next(error);
    }
  },
);

// 상품 수정: PATCH (/api/products/:id)
productsRouter.patch(
  '/:id',
  authMiddleware,
  validate('params', idParamSchema),
  validate('body', updateProductSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, price, tags, image } = req.body;
      const userId = req.user.id;

      const product = await productsRepository.findProductById(id);

      if (!product) {
        throw new NotFoundException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
      }

      // 작성자 본인 확인
      if (product.authorId !== userId) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
      }

      const updatedProduct = await productsRepository.updateProduct(id, {
        name,
        description,
        price,
        tags,
        image,
      });

      res.status(HTTP_STATUS.OK).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
);

// 상품 삭제: DELETE (/api/products/:id)
productsRouter.delete(
  '/:id',
  authMiddleware,
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const product = await productsRepository.findProductById(id);

      if (!product) {
        throw new NotFoundException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
      }

      if (product.authorId !== userId) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
      }

      await productsRepository.deleteProduct(id);

      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);

// 상품 댓글 등록: POST (api/products/:id/comments)
productsRouter.post(
  '/:id/comments',
  authMiddleware,
  validate('params', idParamSchema),
  validate('body', commentSchema),
  async (req, res, next) => {
    try {
      const { id: productId } = req.params;
      const { content } = req.body;

      const newComment = await commentsRepository.createComment('product', {
        content,
        authorId: req.user.id,
        productId: Number(productId),
      });

      res.status(HTTP_STATUS.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  },
);

// 상품 좋아요: POST (/api/products/:id/like)
productsRouter.post(
  '/:id/like',
  authMiddleware,
  // optionalAuth,
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id: targetId } = req.params;
      const userId = req.user.id;

      const existingLike = await likesRepository.findLike(
        'product',
        targetId,
        userId,
      );

      if (existingLike) {
        await likesRepository.removeLike('product', targetId, userId);
        return res.status(HTTP_STATUS.OK).json({ isLiked: false });
      }

      await likesRepository.addLike('product', targetId, userId);
      res.status(HTTP_STATUS.CREATED).json({ isLiked: true });
    } catch (error) {
      next(error);
    }
  },
);
