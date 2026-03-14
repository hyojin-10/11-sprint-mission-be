import express from 'express';
import { commentsRepository } from '#repository';
import { ERROR_MESSAGE, HTTP_STATUS } from '../../common/constants/index.js';
import { authMiddleware, validate } from '#middlewares';
import { ForbiddenException, NotFoundException } from '#exceptions';
import {
  commentListParamSchema,
  commentParamSchema,
  commentSchema,
} from './comments.schema.js';

export const commentsRouter = express.Router();

// 댓글 목록 조회: GET (/api/comments/:type/:targetId)
commentsRouter.get(
  '/:type/:targetId',
  validate('params', commentListParamSchema),
  async (req, res, next) => {
    try {
      const { type, targetId } = req.params;

      const comments = await commentsRepository.findCommentsByTargetId(
        type,
        targetId,
      );

      res.status(HTTP_STATUS.OK).json(comments);
    } catch (error) {
      next(error);
    }
  },
);

// 댓글 수정: PATCH (/api/comments/:type/:id)
commentsRouter.patch(
  '/:type/:id',
  authMiddleware,
  validate('params', commentParamSchema),
  validate('body', commentSchema.partial()),
  async (req, res, next) => {
    try {
      const { type, id } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      const comment = await commentsRepository.findCommentById(type, id);

      if (!comment) {
        throw new NotFoundException(ERROR_MESSAGE.COMMENT_NOT_FOUND);
      }

      if (comment.authorId !== Number(userId)) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
      }

      const updatedComment = await commentsRepository.updateComment(type, id, {
        content,
      });

      res.status(HTTP_STATUS.OK).json(updatedComment);
    } catch (error) {
      next(error);
    }
  },
);

// 댓글 삭제: DELETE (/api/comments/:type/:id)
commentsRouter.delete(
  '/:type/:id',
  authMiddleware,
  validate('params', commentParamSchema),
  async (req, res, next) => {
    try {
      const { type, id } = req.params;
      const userId = req.user.id;

      const comment = await commentsRepository.findCommentById(type, id);

      if (!comment) {
        throw new NotFoundException(ERROR_MESSAGE.COMMENT_NOT_FOUND);
      }

      if (comment.authorId !== Number(userId)) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
      }

      await commentsRepository.deleteComment(type, id);

      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);
