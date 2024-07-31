import { Router } from 'express';
import portfolioBaasRoutes from './portfolio.route';
import contractRoute from './contract.route';

const baasRoutes = Router();

baasRoutes.use('/portfolio', portfolioBaasRoutes);
baasRoutes.use('/contract', contractRoute);

export default baasRoutes;
