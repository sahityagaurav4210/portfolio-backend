import { Router } from 'express';
import Middleware from '../middlewares';
import Controller from '../controllers';

const routes = Router();

routes.post(
  '/generate-client-token',
  Middleware.token().createNewToken,
  Middleware.checkIfAuthenticated,
  Controller.tokens().createClientToken
);

routes.get('/refresh-access-token', Middleware.checkRefToken, Controller.tokens().refreshToken);
routes.post(
  '/refresh-client-token',
  Middleware.token().createNewToken,
  Middleware.checkIfClientAuthenticated,
  Controller.tokens().refreshClientToken
);

export default routes;
