import { Router } from 'express';
import Middleware from '../../middlewares';
import Controller from '../../controllers';
const websiteUpdateRoutes = Router();

websiteUpdateRoutes.get(
  '/last-modified-date',
  Middleware.checkIfClientAuthenticated,
  Controller.home().getLastModifiedDate
);

websiteUpdateRoutes.post(
  '/',
  Middleware.checkIfClientAuthenticated,
  Controller.home().updateWebsiteAccess
);

export default websiteUpdateRoutes;
