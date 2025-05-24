import FilesController from '@controllers/files.controller';
import Middleware from '@middlewares/index';
import { Router } from 'express';

const routes = Router();

routes.post("/save-cv", Middleware.checkIfAuthenticated, FilesController.saveCV);
routes.get('/download-cv', FilesController.downloadCVAdmin);
routes.get('/list-cv', Middleware.checkIfAuthenticated, FilesController.getCVList);
routes.get('/list-all-cv', Middleware.checkIfAuthenticated, FilesController.getAllCVList);

export default routes;