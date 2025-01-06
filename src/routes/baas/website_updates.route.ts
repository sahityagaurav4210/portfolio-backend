import { Router } from 'express';
import Middleware from '../../middlewares';
import Controller from '../../controllers';
const websiteUpdateRoutes = Router();

websiteUpdateRoutes.get(
  '/last-modified-date',
  Middleware.checkIfClientAuthenticated,
  Controller.home().getLastModifiedDate
);

websiteUpdateRoutes.get(
  '/total-website-views',
  Middleware.checkIfClientAuthenticated,
  Controller.home().getWebsiteAccess
);

websiteUpdateRoutes.get(
  '/today-website-views',
  Middleware.checkIfClientAuthenticated,
  Controller.home().getDailyWebsiteViews
);

websiteUpdateRoutes.post(
  '/',
  Middleware.checkIfClientAuthenticated,
  Controller.home().updateWebsiteAccess
);

export default websiteUpdateRoutes;
