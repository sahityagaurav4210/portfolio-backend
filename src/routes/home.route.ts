import { Router } from 'express';
import Controller from '../controllers';
import Middleware from '../middlewares';
import { asyncHandler } from '@helpers/index';

const route = Router();

route.get('/ping', asyncHandler(Controller.home().ping));

route.get(
  '/shut-down',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.home().shutdown)
);

route.get('/captcha', asyncHandler(Controller.home().captcha));

route.get('/captcha/:captchaId', asyncHandler(Controller.home().getCaptchaImg));

route.get('/captcha/audio/:captchaId', asyncHandler(Controller.home().getCaptchaAudio));

route.get(
  '/ref-captcha',
  asyncHandler(Middleware.refreshCaptchaValidator),
  asyncHandler(Controller.home().refreshCaptcha)
);

route.get(
  '/captcha-validate',
  asyncHandler(Middleware.captchaValidateValidator),
  asyncHandler(Controller.home().captchaValidate)
);

route.get('/page-status', asyncHandler(Controller.home().listPageStatus));

route.get(
  '/today-website-views',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.home().getDailyWebsiteViews)
);

route.get(
  '/today-views-details',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.home().getTodayViewsDetails)
);

route.get(
  '/total-website-views',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.home().getWebsiteAccess)
);

route.get(
  '/monthly-website-views',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.home().getMonthlyWebViews)
);

route.post(
  '/update-website',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.home().updateWebsite)
);

route.post(
  '/home/add',
  asyncHandler(Middleware.home().addUserHomeMiddleware),
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.home().addUserHomeSection)
);

route.get(
  '/home/get',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.home().getUserHomeSection)
);

export default route;
