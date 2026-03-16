import { HTTP_STATUS } from '#constants';
import { BaseController } from '#controllers/base.controller.js';
import { needsLogin, optionalAuth, validate } from '#middlewares';
import { idParamSchema, updateUserSchema } from './dto/users.dto.js';

export class UserController extends BaseController {
  #userService;

  constructor({ userService }) {
    super();
    this.#userService = userService;
  }

  routes() {
    this.router.patch(
      '/:id',
      optionalAuth,
      needsLogin,
      validate('params', idParamSchema),
      validate('body', updateUserSchema),
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

  async update(req, res) {
    const { id } = req.params;
    const updatedUser = await this.#userService.changeProfile(
      id,
      req.user.id,
      req.body,
    );
    
    res.status(HTTP_STATUS.OK).json(updatedUser);
  }

  async delete(req, res) {
    const { id } = req.params;
    await this.#userService.deleteAccount(id, req.user.id);

    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  }
}
