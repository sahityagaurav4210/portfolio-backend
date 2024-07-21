import { Router } from 'express';

import homeRoutes from './home.route';
import loginRoutes from './login.route';

const route = Router();

route.use(homeRoutes);
route.use('/authentication', loginRoutes);

export default route;
