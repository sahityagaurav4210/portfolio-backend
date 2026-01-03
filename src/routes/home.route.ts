import { Router } from 'express';
import Controller from '../controllers';
import Middleware from '../middlewares';

const route = Router();

route.get('/ping', Controller.home().ping);
route.get('/shut-down', Middleware.checkIfAuthenticated, Controller.home().shutdown);
route.get('/captcha', Controller.home().captcha);
route.get('/captcha/:captchaId', Controller.home().getCaptchaImg);
route.get('/captcha/audio/:captchaId', Controller.home().getCaptchaAudio);
route.get('/ref-captcha', Middleware.refreshCaptchaValidator, Controller.home().refreshCaptcha);
route.get(
  '/captcha-validate',
  Middleware.captchaValidateValidator,
  Controller.home().captchaValidate
);
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
route.post(
  '/home/add',
  Middleware.home().addUserHomeMiddleware,
  Middleware.checkIfAuthenticated,
  Controller.home().addUserHomeSection
);
route.get('/home/get', Middleware.checkIfAuthenticated, Controller.home().getUserHomeSection);

export default route;
