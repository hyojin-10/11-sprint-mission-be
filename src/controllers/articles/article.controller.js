import { HTTP_STATUS } from '#constants';
import { BaseController } from '#controllers/base.controller.js';
import { needsLogin, optionalAuth, validate } from '#middlewares';
import {
  createArticleSchema,
  idParamSchema,
  updateArticleSchema,
} from './dto/articles.dto.js';

export class ArticleController extends BaseController {
  #articleService;

  constructor({ articleService }) {
    super();
    this.#articleService = articleService;
  }

  routes() {
    this.router.get('/best', (req, res) => this.best(req, res));

    this.router.get('/', optionalAuth, (req, res) => this.list(req, res));

    this.router.get(
      '/:id',
      optionalAuth,
      validate('params', idParamSchema),
      (req, res) => this.detail(req, res),
    );

    this.router.post(
      '/',
      optionalAuth,
      needsLogin,
      validate('body', createArticleSchema),
      (req, res) => this.create(req, res),
    );

    this.router.patch(
      '/:id',
      optionalAuth,
      needsLogin,
      validate('params', idParamSchema),
      validate('body', updateArticleSchema),
      (req, res) => this.update(req, res),
    );

    this.router.delete(
      '/:id',
      optionalAuth,
      needsLogin,
      validate('params', idParamSchema),
      (req, res) => this.delete(req, res),
    );

    return this.router;
  }

  async best(req, res) {
    const bestArticles = await this.#articleService.getBestArticles();

    res.status(HTTP_STATUS.OK).json(bestArticles);
  }

  async list(req, res) {
    const articles = await this.#articleService.getArticles(req.query);

    res.status(HTTP_STATUS.OK).json(articles);
  }

  async detail(req, res) {
    const { id } = req.params;
    const article = await this.#articleService.getArticleDetail(
      id,
      req.user?.id, // 좋아요 확인용
    );

    res.status(HTTP_STATUS.OK).json(article);
  }

  async create(req, res) {
    const article = await this.#articleService.createArticle(
      req.user.id,
      req.body,
    );

    res.status(HTTP_STATUS.CREATED).json(article);
  }

  async update(req, res) {
    const { id } = req.params;
    const updatedArticle = await this.#articleService.updateArticle(
      id,
      req.user.id,
      req.body,
    );

    res.status(HTTP_STATUS.OK).json(updatedArticle);
  }

  async delete(req, res) {
    const { id } = req.params;
    await this.#articleService.deleteArticle(id, req.user.id);
    
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}
