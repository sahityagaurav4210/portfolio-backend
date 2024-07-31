import { Router } from 'express';
import portfolioBaasRoutes from './portfolio.route';

const baasRoutes = Router();

baasRoutes.use('/portfolio', portfolioBaasRoutes);

export default baasRoutes;
