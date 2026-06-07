import Controller from '@controllers/index';
import { asyncHandler } from '@helpers/index';
import Middleware from '@middlewares/index';
import { Router } from 'express';

const publicRoutes = Router();

publicRoutes.get('/verify/token', asyncHandler(Controller.public().checkXuidToken));

publicRoutes.get(
  '/verify/profile-token',
  asyncHandler(Controller.public().checkProfileXuidAuthorizer)
);

publicRoutes.get(
  '/view-profile',
  asyncHandler(Middleware.public().decryptXuidToken),
  asyncHandler(Controller.user().viewProfile)
);

publicRoutes.put(
  '/change-pwd',
  asyncHandler(Middleware.public().decryptXuidToken),
  asyncHandler(Controller.public().publicChangePwd)
);

export default publicRoutes;
