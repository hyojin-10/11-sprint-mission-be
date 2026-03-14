import express from 'express';
import { prisma } from '#db/prisma.js';
import { config, isDevelopment } from '#config';
import cookieParser from 'cookie-parser';
import { router as apiRouter } from './services/index.js';
import { cors, errorHandler, logger } from '#middlewares';
import { setupGracefulShutdown } from '#utils';

const app = express();

app.use(cors);

app.use(express.json());

app.use(cookieParser());

if (isDevelopment) {
  app.use(logger);
}

app.use('/api', apiRouter);

app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`,
  );
});

setupGracefulShutdown(server, prisma);