import { Router } from 'express';
import FilesController from '../../controllers/files.controller';
import { asyncHandler } from '@helpers/index';
import Middleware from '@middlewares/index';

const filesRoute = Router();

filesRoute.get('/download-cv', asyncHandler(FilesController.downloadCV));

filesRoute.get(
  '/download-photo',
  asyncHandler(Middleware.checkIfClientAuthenticated),
  asyncHandler(FilesController.downloadPhoto)
);
filesRoute.post('/download-resume', asyncHandler(FilesController.downloadResume));

export default filesRoute;
