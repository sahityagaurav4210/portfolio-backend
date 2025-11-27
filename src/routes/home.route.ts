import { Router } from 'express';
import Controller from '../controllers';
import Middleware from '../middlewares';

const route = Router();

route.get('/ping', Controller.home().ping);
route.get('/shut-down', Middleware.checkIfAuthenticated, Controller.home().shutdown);
route.get('/captcha', Controller.home().captcha);
route.get('/captcha-validate', Middleware.captchaValidateValidator, Controller.home().captchaValidate);
route.get('/page-status', Controller.home().listPageStatus);

route.get(
  '/today-website-views',
  Middleware.checkIfAuthenticated,
  Controller.home().getDailyWebsiteViews
);

route.get(
  '/today-views-details',
  Middleware.checkIfAuthenticated,
  Controller.home().getTodayViewsDetails
);

route.get(
  '/total-website-views',
  Middleware.checkIfAuthenticated,
  Controller.home().getWebsiteAccess
);

route.get(
  '/monthly-website-views',
  Middleware.checkIfAuthenticated,
  Controller.home().getMonthlyWebViews
);

route.post('/update-website', Middleware.checkIfAuthenticated, Controller.home().updateWebsite);

export default route;
