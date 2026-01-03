import Controller from '@controllers/index';
import { asyncHandler } from '@helpers/index';
import Middleware from '@middlewares/index';
import { Router } from 'express';

const skillRoutes = Router();

skillRoutes.post(
  '/add',
  asyncHandler(Middleware.skills().createNewSkillValidator),
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.skills().create)
);

skillRoutes.get(
  '/list',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.skills().list)
);

skillRoutes.put(
  '/update/:skillId',
  asyncHandler(Middleware.skills().createNewSkillValidator),
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.skills().update)
);

export default skillRoutes;
