import Controller from '@controllers/index';
import { asyncHandler } from '@helpers/index';
import Middleware from '@middlewares/index';
import { Router } from 'express';

const publicRoutes = Router();

publicRoutes.get('/verify/token', asyncHandler(Controller.public().checkXuidToken));

publicRoutes.put(
  '/change-pwd',
  asyncHandler(Middleware.public().decryptXuidToken),
  asyncHandler(Controller.public().publicChangePwd)
);

export default publicRoutes;
