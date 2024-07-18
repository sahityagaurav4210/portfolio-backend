import { Router } from 'express';
import Controller from '../controllers';

const route = Router();

route.get('/ping', Controller.home().ping);
route.get('/shut-down', Controller.home().shutdown);

export default route;
