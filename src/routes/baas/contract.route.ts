import { Router } from 'express';
import Middleware from '../../middlewares';
import Controller from '../../controllers';

const contractRoute = Router();

contractRoute.post(
  '/create',
  Middleware.checkIfClientAuthenticated,
  Middleware.contract().checkIfContractAlreadyExists,
  Controller.contract().create
);
contractRoute.get('/all', Middleware.checkIfClientAuthenticated, Controller.contract().list);

export default contractRoute;
