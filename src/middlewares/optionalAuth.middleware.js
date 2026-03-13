import { verifyToken } from '#utils';
import { prisma } from '#db/prisma.js';

export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const {accessToken} = req.cookies;

    if (!accessToken) {
      req.user = null;
      return next();
    }

    const payload = verifyToken(accessToken, 'access');

    if (!payload) {
      req.user = null;
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, nickname: true },
    });

    req.user = user || null;
    next();
  } catch (_error) {
    req.user = null
    next()
  }
}