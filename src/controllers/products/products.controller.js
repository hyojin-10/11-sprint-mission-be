import { HTTP_STATUS } from '#constants';
import { BaseController } from '#controllers/base.controller.js';
import { needsLogin, optionalAuth, validate } from '#middlewares';
import {
  createProductSchema,
  idParamSchema,
  updateProductSchema,
} from './dto/products.dto.js';

export class ProductController extends BaseController {
  #productService;

  constructor({ productService }) {
    super();
    this.#productService = productService;
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
      validate('body', createProductSchema),
      (req, res) => this.create(req, res),
    );

    this.router.patch(
      '/:id',
      optionalAuth,
      needsLogin,
      validate('params', idParamSchema),
      validate('body', updateProductSchema),
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
    const bestProducts = await this.#productService.getBestProducts();

    res.status(HTTP_STATUS.OK).json(bestProducts);
  }

  async list(req, res) {
    const products = await this.#productService.getProducts(req.query);

    res.status(HTTP_STATUS.OK).json(products);
  }
  async detail(req, res) {
    const { id } = req.params;
    const product = await this.#productService.getProductDetail(
      id,
      req.user?.id, // 좋아요 확인용
    );

    res.status(HTTP_STATUS.OK).json(product);
  }

  async create(req, res) {
    const product = await this.#productService.createProduct(
      req.user.id,
      req.body,
    );

    res.status(HTTP_STATUS.CREATED).json(product);
  }

  async update(req, res) {
    const { id } = req.params;
    const updatedProduct = await this.#productService.updateProduct(
      id,
      req.user.id,
      req.body,
    );

    res.status(HTTP_STATUS.OK).json(updatedProduct);
  }

  async delete(req, res) {
    const { id } = req.params;
    await this.#productService.deleteProduct(id, req.user.id);
    
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}
