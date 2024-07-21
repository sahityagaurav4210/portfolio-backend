import { Router } from 'express';
import Controller from '../controllers';
import Middleware from '../middlewares';

const routes = Router();

routes.post(
  '/login',
  Middleware.authentication().checkIfCredentialsAreCorrect,
  Controller.authentication().login
);

export default routes;
