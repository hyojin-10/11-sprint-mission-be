import { ERROR_MESSAGE } from '#constants';
import { NotFoundException } from '#exceptions';

export class LikeService {
  #likeRepository;
  #productRepository;
  #articleRepository;

  constructor({ likeRepository, productRepository, articleRepository }) {
    this.#likeRepository = likeRepository;
    this.#productRepository = productRepository;
    this.#articleRepository = articleRepository;
  }

  async checkUserLike(type, targetId, userId) {
    if (!userId) {
      return false;
    }
    const like = await this.#likeRepository.check(type, targetId, userId);

    return !!like; // true/false 반환
  }

  async toggleLike(type, targetId, userId) {
    const targetRepo =
      type === 'article' ? this.#articleRepository : this.#productRepository;
    const target = await targetRepo.findById(targetId);

    if (!target) {
      throw new NotFoundException(
        type === 'article'
          ? ERROR_MESSAGE.ARTICLE_NOT_FOUND
          : ERROR_MESSAGE.PRODUCT_NOT_FOUND,
      );
    }

    // 좋아요 상태 확인
    const isLiked = await this.#likeRepository.check(type, targetId, userId);

    // 좋아요 상태면 취소
    if (isLiked) {
      await this.#likeRepository.remove(type, targetId, userId);
      return { isLiked: false };
    }

    // 좋아요 상태 아니면 추가
    await this.#likeRepository.add(type, targetId, userId);
    return { isLiked: true };
  }
}
