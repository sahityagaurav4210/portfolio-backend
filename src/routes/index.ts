import { Router } from 'express';

import homeRoutes from './home.route';
import loginRoutes from './login.route';
import portfolioRoutes from './portfolio.route';
import userRoutes from './user.route';
import baasRoutes from './baas';
import contractRoute from './contract.route';
import hireRoute from './hiring.route';
import fileRoutes from './files.route';
import skillRoutes from './skills.routes';
import networkingRoutes from './networking.route';
import publicRoutes from './public.route';

const route = Router();

route.use(homeRoutes);
route.use('/authentication', loginRoutes);
route.use('/portfolio/skills', skillRoutes);
route.use('/portfolio', portfolioRoutes);
route.use('/user', userRoutes);
route.use('/baas', baasRoutes);
route.use('/contract', contractRoute);
route.use('/hiring', hireRoute);
route.use('/files', fileRoutes);
route.use('/networking', networkingRoutes);
route.use('/public', publicRoutes);

export default route;
