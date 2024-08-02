import { Router } from 'express';

import homeRoutes from './home.route';
import loginRoutes from './login.route';
import portfolioRoutes from './portfolio.route';
import userRoutes from './user.route';
import baasRoutes from './baas';
import contractRoute from './contract.route';

const route = Router();

route.use(homeRoutes);
route.use('/authentication', loginRoutes);
route.use('/portfolio', portfolioRoutes);
route.use('/user', userRoutes);
route.use('/baas', baasRoutes);
route.use('/contract', contractRoute);

export default route;
