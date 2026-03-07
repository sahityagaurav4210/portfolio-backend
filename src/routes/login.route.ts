import { Router } from 'express';
import Controller from '../controllers';
import Middleware from '../middlewares';

import tokenRoutes from './tokens.route';
import { asyncHandler } from '@helpers/index';

const routes = Router();

routes.post(
  '/login',
  asyncHandler(Middleware.authentication().checkIfCredentialsAreCorrect),
  asyncHandler(Middleware.authentication().checkIfCaptchaValidated),
  asyncHandler(Controller.authentication().login)
);

routes.post(
  '/logout',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.authentication().logout)
);

routes.get(
  '/get-me',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.authentication().getMe)
);

routes.use('/tokens', tokenRoutes);

export default routes;
