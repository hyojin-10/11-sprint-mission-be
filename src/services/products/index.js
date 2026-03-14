import express from 'express';
import { productsRouter } from './products.routes.js';

export const productRouter = express.Router();

productRouter.use('/', productsRouter);