import { Router } from 'express';
import portfolioBaasRoutes from './portfolio.route';
import contractRoute from './contract.route';
import hiringRoute from './hiring.route';
import websiteUpdateRoutes from './website_updates.route';
import filesRoute from './files.route';

const baasRoutes = Router();

baasRoutes.use('/portfolio', portfolioBaasRoutes);
baasRoutes.use('/contract', contractRoute);
baasRoutes.use('/hiring', hiringRoute);
baasRoutes.use('/website', websiteUpdateRoutes);
baasRoutes.use('/files', filesRoute);

export default baasRoutes;
