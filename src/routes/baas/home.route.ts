import Controller from '@controllers/index';
import { asyncHandler } from '@helpers/index';
import Middleware from '@middlewares/index';
import { Router } from 'express';

const homeBaasRoutes = Router();

homeBaasRoutes.get(
  '/get',
  asyncHandler(Middleware.checkIfClientAuthenticated),
  asyncHandler(Controller.home().getUserHomeSection)
);

export default homeBaasRoutes;
