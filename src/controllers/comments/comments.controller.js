import { HTTP_STATUS } from '#constants';
import { BaseController } from '#controllers/base.controller.js';
import { needsLogin, optionalAuth, validate } from '#middlewares';
import {
  commentListParamSchema,
  commentParamSchema,
  commentSchema,
} from './dto/comments.dto.js';

export class CommentController extends BaseController {
  #commentService;

  constructor({ commentService }) {
    super();
    this.#commentService = commentService;
  }

  routes() {
    this.router.get(
      '/',
      validate('query', commentListParamSchema),
      (req, res) => this.list(req, res),
    );

    this.router.post(
      '/',
      optionalAuth,
      needsLogin,
      validate('body', commentSchema),
      (req, res) => this.create(req, res),
    );

    this.router.patch(
      '/:id',
      optionalAuth,
      needsLogin,
      validate('params', commentParamSchema),
      validate('body', commentSchema),
      (req, res) => this.update(req, res),
    );

    this.router.delete(
      '/:id',
      optionalAuth,
      needsLogin,
      validate('params', commentParamSchema),
      (req, res) => this.delete(req, res),
    );

    return this.router;
  }

  async list(req, res) {
    const comments = await this.#commentService.getComments(req.query);

    res.status(HTTP_STATUS.OK).json(comments);
  }

  async create(req, res) {
    const comment = await this.#commentService.createComment(
      req.user.id,
      req.body,
    );

    res.status(HTTP_STATUS.CREATED).json(comment);
  }

  async update(req, res) {
    const { id } = req.params;
    const updatedComment = await this.#commentService.updateComment(
      id,
      req.user.id,
      req.body,
    );

    res.status(HTTP_STATUS.OK).json(updatedComment);
  }

  async delete(req, res) {
    const { id } = req.params;
    await this.#commentService.deleteComment(id, req.user.id);

    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  }
}
