import { Router } from 'express';
import Middleware from '../../middlewares';
import Controller from '../../controllers';

const hiringRoute = Router();

hiringRoute.post('/add', Middleware.checkIfClientAuthenticated, Controller.hiring().add);

export default hiringRoute;
