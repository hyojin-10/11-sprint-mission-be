import express from 'express';
import { authRouter as router } from './auth.routes.js';

export const authRouter = express.Router();

authRouter.use('/', router);