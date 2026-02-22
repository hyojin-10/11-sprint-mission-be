import express from 'express';
import { commentsRouter } from './comments.routes.js';

export const commentRouter = express.Router();

commentRouter.use('/', commentsRouter);