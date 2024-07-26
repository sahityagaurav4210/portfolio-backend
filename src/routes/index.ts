import { Router } from 'express';

import homeRoutes from './home.route';
import loginRoutes from './login.route';
import portfolioRoutes from './portfolio.route';

const route = Router();

route.use(homeRoutes);
route.use('/authentication', loginRoutes);
route.use('/portfolio', portfolioRoutes);

export default route;
