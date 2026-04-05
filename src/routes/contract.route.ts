import { Router } from 'express';
import Middleware from '../middlewares';
import Controller from '../controllers';
import { asyncHandler } from '@helpers/index';

const contractRoute = Router();

contractRoute.get(
  '/all',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.contract().list)
);

contractRoute.delete(
  '/delete/:contactId',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.contract().delete)
);

export default contractRoute;
