import { Router } from 'express';
import Controller from '../controllers';
import Middleware from '../middlewares';

const route = Router();

route.get('/ping', Controller.home().ping);
route.get('/shut-down', Middleware.checkIfAuthenticated, Controller.home().shutdown);
route.get('/captcha', Controller.home().captcha);
route.get('/captcha-validate', Controller.home().captchaValidate);
route.post('/update-website', Middleware.checkIfAuthenticated, Controller.home().updateWebsite);

export default route;
