import 'dotenv/config';
import Crypto from '@config/crypto.config';

import cluster from 'cluster';
import * as os from 'os';

import app from './app';
import Scheduler from '@config/scheduler.config';
import { connect } from '@db/index';
import { createAdmin, updateWebsites } from '@db/dumps';
import { getAppDetails } from '@config/app.config';

const PORT = parseInt(process.env.PORT || '') || 8000;
const HOST = process.env.HOST || 'localhost';

(async function () {
  const numCPUs = os.availableParallelism();
  let counter = 0;

  const status = await connect(
    process.env.DATABASE_CONN_STRING || '',
    process.env.DATABASE_NAME || 'portfolio'
  );

  if (status.connected) {
    await createAdmin();
    await updateWebsites();
    Scheduler.init();
    await Crypto.getGlobalCryptoConfigs();
  } else {
    console.log('Could not connect to database...');
    process.exit(-1);
  }

  app.listen(PORT, HOST);
  console.table(getAppDetails(PORT, HOST, process.env.NODE_ENV || ''));

})();
