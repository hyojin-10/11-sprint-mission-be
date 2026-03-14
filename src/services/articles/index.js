import express from 'express';
import { articlesRouter } from './articles.routes.js';

export const articleRouter = express.Router();

articleRouter.use('/', articlesRouter)