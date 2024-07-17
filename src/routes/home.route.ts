import { Router } from 'express';
import Controller from '../controllers';

const route = Router();

route.get('/ping', Controller.home().ping);

export default route;
