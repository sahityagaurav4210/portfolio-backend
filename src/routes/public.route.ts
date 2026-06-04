import Controller from '@controllers/index';
import Middleware from '@middlewares/index';
import { Router } from 'express';

const publicRoutes = Router();

publicRoutes.get('/verify/token', Controller.public().checkXuidToken);

publicRoutes.put(
  '/change-pwd',
  Middleware.public().decryptXuidToken,
  Controller.public().publicChangePwd
);

export default publicRoutes;
