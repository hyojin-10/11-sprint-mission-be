import { ERROR_MESSAGE } from '#constants';
import { ForbiddenException, NotFoundException } from '#exceptions';

export class ArticleService {
  #articleRepository;
  #likeService;

  constructor({ articleRepository, likeService }) {
    this.#articleRepository = articleRepository;
    this.#likeService = likeService;
  }

  async getArticles(params) {
    return await this.#articleRepository.findAll(params);
  }

  async getBestArticles() {
    return await this.#articleRepository.findBest();
  }

  async getArticleDetail(id, userId) {
    const article = await this.#articleRepository.findById(id);
    if (!article) {
      throw new NotFoundException(ERROR_MESSAGE.ARTICLE_NOT_FOUND);
    }

    // 좋아요 상태 확인
    const isLiked = await this.#likeService.checkUserLike(
      'article',
      id,
      userId,
    );

    return {
      ...article,
      isLiked,
    };
  }

  async createArticle(userId, data) {
    return await this.#articleRepository.create({
      ...data,
      authorId: userId,
    });
  }

  async updateArticle(id, userId, data) {
    const article = await this.#articleRepository.findById(id);
    if (!article) {
      throw new NotFoundException(ERROR_MESSAGE.ARTICLE_NOT_FOUND);
    }

    // 작성자인지 확인
    if (article.authorId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
    }

    return await this.#articleRepository.update(id, data);
  }

  async deleteArticle(id, userId) {
    const article = await this.#articleRepository.findById(id);
    if (!article) {
      throw new NotFoundException(ERROR_MESSAGE.ARTICLE_NOT_FOUND);
    }

    if (article.authorId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
    }

    await this.#articleRepository.delete(id);
  }
}
