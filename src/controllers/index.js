import { format } from 'date-fns';
import { BaseController } from './base.controller.js';

export * from './auth/index.js';
export * from './users/index.js';
export * from './products/index.js';
export * from './articles/index.js';
export * from './comments/index.js';
export * from './likes/index.js';

export class Controller extends BaseController {
  #authController;
  #userController;
  #productController;
  #articleController;
  #commentController;
  #likeController;

  constructor({
    authController,
    userController,
    productController,
    articleController,
    commentController,
    likeController,
  }) {
    super();
    this.#authController = authController;
    this.#userController = userController;
    this.#productController = productController;
    this.#articleController = articleController;
    this.#commentController = commentController;
    this.#likeController = likeController;
  }

  routes() {
    this.router.use('/auth', this.#authController.routes());
    this.router.use('/users', this.#userController.routes());
    this.router.use('/products', this.#productController.routes());
    this.router.use('/articles', this.#articleController.routes());
    this.router.use('/comments', this.#commentController.routes());
    this.router.use('/likes', this.#likeController.routes());

    this.router.get('/ping', (req, res) => this.ping(req, res));

    return this.router;
  }

  ping(req, res) {
    const time = new Date();
    const formattedTime = format(time, 'yyyy-MM-dd HH:mm:ss');
    const message = `서버 상태 정상 - 현재 시간: ${formattedTime}`;
    res.status(200).json({ message });
  }
}
