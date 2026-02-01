import { Router } from 'express';
import Middleware from '../../middlewares';
import Controller from '../../controllers';
import { asyncHandler } from '@helpers/index';

const hiringRoute = Router();

hiringRoute.post(
  '/add',
  asyncHandler(Middleware.hiring().addHiringDetailsValidator),
  asyncHandler(Middleware.checkIfClientAuthenticated),
  asyncHandler(Controller.hiring().add)
);

export default hiringRoute;
