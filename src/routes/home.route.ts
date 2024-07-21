import { Router } from 'express';
import Controller from '../controllers';
import Middleware from '../middlewares';

const route = Router();

route.get('/ping', Controller.home().ping);
route.get('/shut-down', Middleware.checkIfAuthenticated, Controller.home().shutdown);

export default route;
