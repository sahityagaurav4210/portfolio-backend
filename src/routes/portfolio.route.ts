import { Router } from 'express';
import Middleware from '../middlewares';
import Controller from '../controllers';

const routes = Router();

routes.post(
  '/create',
  Middleware.checkIfAuthenticated,
  Middleware.portfolio().createNewPortfolioValidator,
  Controller.portfolio().create
);
routes.get('/all', Middleware.checkIfAuthenticated, Controller.portfolio().list);
routes.get('/:portfolio_user', Middleware.checkIfAuthenticated, Controller.portfolio().get);
routes.put(
  '/:portfolioId',
  Middleware.portfolio().updatePortfolioValidator,
  Middleware.checkIfAuthenticated,
  Controller.portfolio().edit
);

export default routes;
