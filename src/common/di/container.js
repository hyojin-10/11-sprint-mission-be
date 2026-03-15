import {
  createContainer as createAwilixContainer,
  asClass,
  asValue,
  InjectionMode,
  Lifetime,
} from 'awilix';
import { prisma } from '#db/prisma.js';
import {
  UserRepository,
  ProductRepository,
  ArticleRepository,
  CommentRepository,
  LikeRepository,
} from '#repository';
import {
  AuthService,
  UserService,
  ProductService,
  ArticleService,
  CommentService,
  LikeService,
} from '#services';
import {
  AuthController,
  UserController,
  ProductController,
  ArticleController,
  CommentController,
  LikeController,
  Controller,
} from '#controllers';
import { PasswordProvider, TokenProvider, CookieProvider } from '#providers';
import { AuthMiddleware } from '#middlewares';

export const createContainer = () => {
  const container = createAwilixContainer({
    injectionMode: InjectionMode.PROXY,
    strict: true,
  });

  container.register({
    prisma: asValue(prisma),
    userRepository: asClass(UserRepository, { lifetime: Lifetime.SINGLETON }),
    productRepository: asClass(ProductRepository, {
      lifetime: Lifetime.SINGLETON,
    }),
    articleRepository: asClass(ArticleRepository, {
      lifetime: Lifetime.SINGLETON,
    }),
    commentRepository: asClass(CommentRepository, {
      lifetime: Lifetime.SINGLETON,
    }),
    likeRepository: asClass(LikeRepository, { lifetime: Lifetime.SINGLETON }),

    passwordProvider: asClass(PasswordProvider, {
      lifetime: Lifetime.SINGLETON,
    }),
    tokenProvider: asClass(TokenProvider, { lifetime: Lifetime.SINGLETON }),
    cookieProvider: asClass(CookieProvider, { lifetime: Lifetime.SINGLETON }),

    authService: asClass(AuthService, { lifetime: Lifetime.SINGLETON }),
    userService: asClass(UserService, { lifetime: Lifetime.SINGLETON }),
    productService: asClass(ProductService, { lifetime: Lifetime.SINGLETON }),
    articleService: asClass(ArticleService, { lifetime: Lifetime.SINGLETON }),
    commentService: asClass(CommentService, { lifetime: Lifetime.SINGLETON }),
    likeService: asClass(LikeService, { lifetime: Lifetime.SINGLETON }),

    authMiddleware: asClass(AuthMiddleware, { lifetime: Lifetime.SINGLETON }),

    authController: asClass(AuthController, { lifetime: Lifetime.SINGLETON }),
    userController: asClass(UserController, { lifetime: Lifetime.SINGLETON }),
    productController: asClass(ProductController, {
      lifetime: Lifetime.SINGLETON,
    }),
    articleController: asClass(ArticleController, {
      lifetime: Lifetime.SINGLETON,
    }),
    commentController: asClass(CommentController, {
      lifetime: Lifetime.SINGLETON,
    }),
    likeController: asClass(LikeController, { lifetime: Lifetime.SINGLETON }),

    controller: asClass(Controller, { lifetime: Lifetime.SINGLETON }),
  });

  return container.cradle;
};
