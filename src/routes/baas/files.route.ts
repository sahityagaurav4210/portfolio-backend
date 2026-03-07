import { Router } from 'express';
import FilesController from '../../controllers/files.controller';
import { asyncHandler } from '@helpers/index';

const filesRoute = Router();

filesRoute.get('/download-cv', asyncHandler(FilesController.downloadCV));
filesRoute.get('/download-photo', asyncHandler(FilesController.downloadPhoto));
filesRoute.post('/download-resume', asyncHandler(FilesController.downloadResume));

export default filesRoute;
