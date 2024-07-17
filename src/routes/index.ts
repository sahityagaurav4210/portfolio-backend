import { Router } from 'express';

import homeRoutes from './home.route';

const route = Router();

route.use(homeRoutes);

export default route;
