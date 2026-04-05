import portfolioBuilderBackendSkillsUpload from '@config/skills_upload.config';
import Controller from '@controllers/index';
import { asyncHandler } from '@helpers/index';
import Middleware from '@middlewares/index';
import { Router } from 'express';

const skillRoutes = Router();

skillRoutes.post(
  '/add',
  portfolioBuilderBackendSkillsUpload.single('skill'),
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
  portfolioBuilderBackendSkillsUpload.single('skill'),
  asyncHandler(Middleware.skills().createNewSkillValidator),
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.skills().update)
);

skillRoutes.put(
  '/update/:skillId',
  portfolioBuilderBackendSkillsUpload.single('skill'),
  asyncHandler(Middleware.skills().createNewSkillValidator),
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.skills().update)
);

skillRoutes.delete(
  '/delete/:skillId',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.skills().delete)
);

export default skillRoutes;
