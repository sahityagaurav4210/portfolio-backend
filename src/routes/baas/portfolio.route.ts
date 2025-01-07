import { Router } from 'express';
import Middleware from '../../middlewares';
import Controller from '../../controllers';

const portfolioBaasRoutes = Router();

portfolioBaasRoutes.get(
  '/all',
  Middleware.checkIfClientAuthenticated,
  Controller.portfolio().clientList
);

export default portfolioBaasRoutes;
