import express from 'express';
import {
  articlesRepository,
  commentsRepository,
  likesRepository,
} from '#repository';
import { ARTICLE_PAGELIMIT, ERROR_MESSAGE, HTTP_STATUS } from '#constants';
import { authMiddleware, validate } from '#middlewares';
import { ForbiddenException, NotFoundException } from '#exceptions';
import {
  createArticleSchema,
  idParamSchema,
  updateArticleSchema,
} from './articles.schema.js';
import { commentSchema } from '../comments/comments.schema.js';

export const articlesRouter = express.Router();

// 게시글 생성: POST (/api/articles)
articlesRouter.post(
  '/',
  authMiddleware,
  validate('body', createArticleSchema),
  async (req, res, next) => {
    try {
      const { title, content, image } = req.body;
      const authorId = req.user.id;

      const newArticle = await articlesRepository.createArticle({
        title,
        content,
        image,
        authorId,
      });

      res.status(HTTP_STATUS.CREATED).json(newArticle);
    } catch (error) {
      next(error);
    }
  },
);

// 모든 게시글 조회: GET (/api/articles)
articlesRouter.get('/', async (req, res, next) => {
  try {
    const { page, limit, keyword, sort } = req.query;

    const articles = await articlesRepository.findAllArticles({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : ARTICLE_PAGELIMIT,
      keyword,
      sort,
    });

    res.status(HTTP_STATUS.OK).json(articles);
  } catch (error) {
    next(error);
  }
});

// 베스트 게시글 조회: GET (/api/articles/best)
articlesRouter.get('/best', async (req, res, next) => {
  try {
    const bestArticles = await articlesRepository.findBestArticles();

    res.status(HTTP_STATUS.OK).json(bestArticles);
  } catch (error) {
    next(error);
  }
});

// 특정 게시글 조회: GET (/api/articles/:id)
articlesRouter.get(
  '/:id',
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const article = await articlesRepository.findArticleById(id);

      if (!article) {
        throw new NotFoundException(ERROR_MESSAGE.ARTICLE_NOT_FOUND);
      }

      res.status(HTTP_STATUS.OK).json(article);
    } catch (error) {
      next(error);
    }
  },
);

// 게시글 수정: PATCH (/api/articles/:id)
articlesRouter.patch(
  '/:id',
  authMiddleware,
  validate('params', idParamSchema),
  validate('body', updateArticleSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content, image } = req.body;
      const userId = req.user.id;

      const article = await articlesRepository.findArticleById(id);

      if (!article) {
        throw new NotFoundException(ERROR_MESSAGE.ARTICLE_NOT_FOUND);
      }

      // 작성자 본인 확인
      if (article.authorId !== userId) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
      }

      const updatedArticle = await articlesRepository.updateArticle(id, {
        title,
        content,
        image,
      });

      res.status(HTTP_STATUS.OK).json(updatedArticle);
    } catch (error) {
      next(error);
    }
  },
);

// 게시글 삭제: DELETE (/api/articles/:id)
articlesRouter.delete(
  '/:id',
  authMiddleware,
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const article = await articlesRepository.findArticleById(id);

      if (!article) {
        throw new NotFoundException(ERROR_MESSAGE.ARTICLE_NOT_FOUND);
      }

      // 작성자 본인 확인
      if (article.authorId !== userId) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
      }

      await articlesRepository.deleteArticle(id);

      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);

// 게시글 댓글 등록: POST (api/articles/:id/comments)
articlesRouter.post(
  '/:id/comments',
  authMiddleware,
  validate('params', idParamSchema),
  validate('body', commentSchema),
  async (req, res, next) => {
    try {
      const { id: articleId } = req.params;
      const { content } = req.body;

      const newComment = await commentsRepository.createComment('article', {
        content,
        authorId: req.user.id,
        articleId: Number(articleId),
      });

      res.status(HTTP_STATUS.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  },
);

// 게시글 좋아요: POST (/api/articles/:id/like)
articlesRouter.post(
  '/:id/like',
  authMiddleware,
  // optionalAuth,
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id: targetId } = req.params;
      const userId = req.user.id;

      const existingLike = await likesRepository.findLike(
        'article',
        targetId,
        userId,
      );

      if (existingLike) {
        // 이미 있으면 취소
        await likesRepository.removeLike('article', targetId, userId);
        return res.status(HTTP_STATUS.OK).json({ isLiked: false });
      }

      // 없으면 추가
      await likesRepository.addLike('article', targetId, userId);
      res.status(HTTP_STATUS.CREATED).json({ isLiked: true });
    } catch (error) {
      next(error);
    }
  },
);
