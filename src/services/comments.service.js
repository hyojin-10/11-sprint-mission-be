import { ERROR_MESSAGE } from '#constants';
import { ForbiddenException, NotFoundException } from '#exceptions';

export class CommentService {
  #commentRepository;

  constructor({ commentRepository }) {
    this.#commentRepository = commentRepository;
  }

  async getComments(type, targetId) {
    return await this.#commentRepository.findByTargetId(type, targetId);
  }

  async createComment(type, targetId, userId, content) {
    return await this.#commentRepository.create(type, {
      content,
      authorId: userId,
      [`${type}Id`]: Number(targetId),
    });
  }

  async updateComment(type, commentId, userId, content) {
    const comment = await this.#commentRepository.findById(type, commentId);
    if (!comment) {
      throw new NotFoundException(ERROR_MESSAGE.COMMENT_NOT_FOUND);
    }

    // 작성자인지 확인
    if (comment.authorId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
    }

    return await this.#commentRepository.update(type, commentId, { content });
  }

  async deleteComment(type, commentId, userId) {
    const comment = await this.#commentRepository.findById(type, commentId);
    if (!comment) {
      throw new NotFoundException(ERROR_MESSAGE.COMMENT_NOT_FOUND);
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
    }

    await this.#commentRepository.delete(type, commentId);
  }
}
