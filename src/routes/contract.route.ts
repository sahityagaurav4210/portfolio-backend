import { Router } from 'express';
import Middleware from '../middlewares';
import Controller from '../controllers';

const contractRoute = Router();

contractRoute.get('/all', Middleware.checkIfAuthenticated, Controller.contract().list);

export default contractRoute;
