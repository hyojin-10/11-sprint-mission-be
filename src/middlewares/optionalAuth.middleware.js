import { prisma } from '#db/prisma.js';
import { TokenProvider } from '#providers';

export const optionalAuth = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      req.user = null;
      return next();
    }

    const payload = TokenProvider.verifyAccessToken(accessToken);

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
    req.user = null;
    next();
  }
};
