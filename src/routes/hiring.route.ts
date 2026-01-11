import { Router } from 'express';
import Middleware from '../middlewares';
import Controller from '../controllers';
import { asyncHandler } from '@helpers/index';

const hireRoute = Router();

hireRoute.get(
  '/all',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.hiring().list)
);

hireRoute.delete(
  '/delete/:hiringId',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.hiring().delete)
);

hireRoute.delete(
  '/soft-delete/:hiringId',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.hiring().softDelete)
);

export default hireRoute;
