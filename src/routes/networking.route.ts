import Controller from '@controllers/index';
import { asyncHandler } from '@helpers/index';
import Middleware from '@middlewares/index';
import { Router } from 'express';

const networkingRoutes = Router();

networkingRoutes.get(
  '/location',
  asyncHandler(Middleware.networking().validatefetchIpLocReq),
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.networking().fetchIpLocDetails)
);

export default networkingRoutes;
