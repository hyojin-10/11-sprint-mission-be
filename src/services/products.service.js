import { ERROR_MESSAGE } from '#constants';
import { ForbiddenException, NotFoundException } from '#exceptions';

export class ProductService {
  #productRepository;
  #likeService;

  constructor({ productRepository, likeService }) {
    this.#productRepository = productRepository;
    this.#likeService = likeService;
  }

  async getProducts(params) {
    return await this.#productRepository.findAll(params);
  }

  async getBestProducts() {
    return await this.#productRepository.findBest();
  }

  async getProductDetail(id, userId) {
    const product = await this.#productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
    }

    // 좋아요 상태 확인
    const isLiked = await this.#likeService.checkUserLike(
      'product',
      id,
      userId,
    );

    return {
      ...product,
      isLiked,
    };
  }

  async createProduct(userId, data) {
    return await this.#productRepository.create({
      ...data,
      authorId: userId,
    });
  }

  async updateProduct(id, userId, data) {
    const product = await this.#productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
    }

    // 작성자인지 확인
    if (product.authorId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
    }

    return await this.#productRepository.update(id, data);
  }

  async deleteProduct(id, userId) {
    const product = await this.#productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
    }

    if (product.authorId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
    }

    await this.#productRepository.delete(id);
  }
}
