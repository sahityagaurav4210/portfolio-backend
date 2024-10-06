import { Router } from 'express';
import FilesController from '../../controllers/files.controller';

const filesRoute = Router();

filesRoute.get('/download-cv', FilesController.downloadCV);
filesRoute.get('/download-photo', FilesController.downloadPhoto);

export default filesRoute;
