import { Router } from 'express';
import Controller from '../controllers';
import Middleware from '../middlewares';

import tokenRoutes from './tokens.route';

const routes = Router();

routes.post(
  '/login',
  Middleware.authentication().checkIfCredentialsAreCorrect,
  Controller.authentication().login
);

routes.post('/logout', Middleware.checkIfAuthenticated, Controller.authentication().logout);

routes.use('/tokens', tokenRoutes);

export default routes;
