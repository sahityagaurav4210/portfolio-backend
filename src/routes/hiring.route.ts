import { Router } from 'express';
import Middleware from '../middlewares';
import Controller from '../controllers';

const hireRoute = Router();

hireRoute.get('/all', Middleware.checkIfAuthenticated, Controller.hiring().list);
hireRoute.delete('/:hiringId', Middleware.checkIfAuthenticated, Controller.hiring().delete);

export default hireRoute;
