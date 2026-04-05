import Controller from '@controllers/index';
import { asyncHandler } from '@helpers/index';
import Middleware from '@middlewares/index';
import { Router } from 'express';

const clientSkillRoutes = Router();

clientSkillRoutes.get(
  '/list',
  asyncHandler(Middleware.checkIfClientAuthenticated),
  asyncHandler(Controller.skills().clientSkillList)
);

export default clientSkillRoutes;
