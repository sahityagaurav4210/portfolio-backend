import 'dotenv/config';
import app from './app';
import { getAppDetails } from '@config/app.config';
import run from './server';

const PORT = parseInt(process.env.PORT || '') || 8000;
const HOST = process.env.HOST || 'localhost';

(async function () {
  await run();
  app.listen(PORT, HOST);
  console.table(getAppDetails(PORT, HOST, process.env.NODE_ENV || ''));
})();
