import { verifyToken } from '#utils';
import { prisma } from '#db/prisma.js';
import { ERROR_MESSAGE } from '#constants';
import { UnauthorizedException } from '#exceptions';

export const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw new UnauthorizedException(ERROR_MESSAGE.NO_AUTH_TOKEN);
    }

    const payload = verifyToken(accessToken, 'access');

    if (!payload) {
      throw new UnauthorizedException(ERROR_MESSAGE.INVALID_TOKEN);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, nickname: true },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_FOUND_FROM_TOKEN);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
