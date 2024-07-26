import { Router } from 'express';
import Middleware from '../middlewares';
import Controller from '../controllers';

const routes = Router();

routes.get(
  '/generate-client-token',
  Middleware.checkIfAuthenticated,
  Controller.tokens().createClientToken
);

routes.get('/refresh-access-token', Controller.tokens().refreshToken);
routes.get('/refresh-client-token', Controller.tokens().refreshClientToken);

export default routes;
