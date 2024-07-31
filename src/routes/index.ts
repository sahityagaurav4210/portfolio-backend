import { Router } from 'express';

import homeRoutes from './home.route';
import loginRoutes from './login.route';
import portfolioRoutes from './portfolio.route';
import userRoutes from './user.route';
import baasRoutes from './baas';

const route = Router();

route.use(homeRoutes);
route.use('/authentication', loginRoutes);
route.use('/portfolio', portfolioRoutes);
route.use('/user', userRoutes);
route.use('/baas', baasRoutes);
export default route;
