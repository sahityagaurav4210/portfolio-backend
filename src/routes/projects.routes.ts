import portfolioBuilderBackendImageUpload from '@config/image_upload.config';
import Controller from '@controllers/index';
import { asyncHandler } from '@helpers/index';
import Middleware from '@middlewares/index';
import { Router } from 'express';

const projectRoutes = Router();

projectRoutes.post(
  '/add',
  portfolioBuilderBackendImageUpload.single('cardImage'),
  asyncHandler(Middleware.projects().createProjectValidator),
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.projects().create)
);

projectRoutes.get(
  '/list',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.projects().list)
);

projectRoutes.put(
  '/update/:projectId',
  portfolioBuilderBackendImageUpload.single('cardImage'),
  asyncHandler(Middleware.projects().updateProjectValidator),
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.projects().update)
);

projectRoutes.delete(
  '/delete/:projectId',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.projects().delete)
);

export default projectRoutes;
