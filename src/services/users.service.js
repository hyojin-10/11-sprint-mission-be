import { ERROR_MESSAGE } from '#constants';
import { ForbiddenException, NotFoundException } from '#exceptions';

export class UserService {
  #userRepository;

  constructor({ userRepository }) {
    this.#userRepository = userRepository;
  }

  async changeProfile(id, reqUserId, { email, nickname }) {
    if (Number(reqUserId) !== Number(id)) {
      throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
    }

    const existingUser = await this.#userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    return await this.#userRepository.update(id, { email, nickname });
  }

  async deleteAccount(id, reqUserId) {
    if (Number(reqUserId) !== Number(id)) {
      throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
    }

    const existingUser = await this.#userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    await this.#userRepository.delete(id);
  }
}
