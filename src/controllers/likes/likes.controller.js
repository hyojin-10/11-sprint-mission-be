import { HTTP_STATUS } from '#constants';
import { BaseController } from '#controllers/base.controller.js';
import { needsLogin, optionalAuth, validate } from '#middlewares';
import { likeSchema } from './dto/likes.dto.js';

export class LikeController extends BaseController {
  #likeService;

  constructor({ likeService }) {
    super();
    this.#likeService = likeService;
  }

  routes() {
    this.router.post(
      '/',
      optionalAuth,
      needsLogin,
      validate('body', likeSchema),
      (req, res) => this.handleLike(req, res),
    );

    return this.router;
  }

  async handleLike(req, res) {
    const result = await this.#likeService.toggleLike(req.user.id, req.body);
    
    res.status(HTTP_STATUS.OK).json(result);
  }
}
