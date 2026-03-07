import portfolioBuilderBackendFileUpload from '@config/file_upload.config';
import FilesController from '@controllers/files.controller';
import { asyncHandler } from '@helpers/index';
import Middleware from '@middlewares/index';
import { Router } from 'express';

const routes = Router();

routes.post(
  '/save-cv',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(FilesController.saveCV)
);

/**
 * @route POST /api/v1/files/upload-resume
 * @access private
 * @description This route allows authenticated users to update their resumes
 */
routes.post(
  '/upload-resume',
  portfolioBuilderBackendFileUpload.single('resume'),
  asyncHandler(Middleware.files().uploadResumeValidator),
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(FilesController.saveUserResume)
);

routes.get('/download-cv', asyncHandler(FilesController.downloadCVAdmin));

routes.get(
  '/list-cv',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(FilesController.getCVList)
);

routes.get(
  '/list-all-cv',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(FilesController.getAllCVList)
);

export default routes;
