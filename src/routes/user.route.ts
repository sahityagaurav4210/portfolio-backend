import { Router } from 'express';
import Middleware from '../middlewares';
import Controller from '../controllers';

const route = Router();

route.put('/edit-profile', Middleware.checkIfAuthenticated, Controller.user().editProfile);

export default route;
