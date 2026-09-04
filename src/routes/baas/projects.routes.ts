import Controller from '@controllers/index';
import { asyncHandler } from '@helpers/index';
import Middleware from '@middlewares/index';
import { Router } from 'express';

const clientProjectRoutes = Router();

clientProjectRoutes.get(
  '/',
  asyncHandler(Middleware.checkIfClientAuthenticated),
  asyncHandler(Controller.projects().clientProjectList)
);

clientProjectRoutes.get(
  '/list',
  asyncHandler(Middleware.checkIfClientAuthenticated),
  asyncHandler(Controller.projects().clientProjectList)
);

export default clientProjectRoutes;
