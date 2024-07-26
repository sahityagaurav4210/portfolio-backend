import { Router } from 'express';
import Controller from '../controllers';
import Middleware from '../middlewares';

const routes = Router();

routes.post(
  '/login',
  Middleware.authentication().checkIfCredentialsAreCorrect,
  Controller.authentication().login
);

routes.post('/logout', Middleware.checkIfAuthenticated, Controller.authentication().logout);
routes.get('/refresh-token', Controller.authentication().refreshToken);

export default routes;
