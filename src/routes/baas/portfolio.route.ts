import { Router } from 'express';
import Middleware from '../../middlewares';
import Controller from '../../controllers';
import clientSkillRoutes from './skills.route';
import clientProjectRoutes from './projects.routes';

const portfolioBaasRoutes = Router();

portfolioBaasRoutes.get(
  '/all',
  Middleware.checkIfClientAuthenticated,
  Controller.portfolio().clientList
);

portfolioBaasRoutes.use('/skills', clientSkillRoutes);
portfolioBaasRoutes.use('/projects', clientProjectRoutes);

export default portfolioBaasRoutes;
