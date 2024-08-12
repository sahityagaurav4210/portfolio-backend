import { Router } from 'express';
import portfolioBaasRoutes from './portfolio.route';
import contractRoute from './contract.route';
import hiringRoute from './hiring.route';

const baasRoutes = Router();

baasRoutes.use('/portfolio', portfolioBaasRoutes);
baasRoutes.use('/contract', contractRoute);
baasRoutes.use('/hiring', hiringRoute);

export default baasRoutes;
