import 'dotenv/config';
import Crypto from '@config/crypto.config';

import cluster from 'cluster';
import * as os from 'os';

import app from './app';
import Scheduler from '@config/scheduler.config';
import { connect } from '@db/index';
import { createAdmin } from '@db/dumps';
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
    Scheduler.init();
    await Crypto.getGlobalCryptoConfigs();
  } else {
    console.log('Could not connect to database...');
    process.exit(-1);
  }

  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork({ WORKER_COUNT: counter, ...process.env });
      ++counter;
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(
        `[Master] Worker [pid:${worker.process.pid}] [code: ${code}] [signal: ${signal}] died. Restarting...`
      );
      cluster.fork({ WORKER_COUNT: counter, ...process.env });
    });
  } else {
    try {
      const worker = Number(process.env.WORKER_COUNT || 0);
      app.listen(PORT, HOST);

      if (worker === numCPUs - 1)
        console.table(getAppDetails(PORT, HOST, process.env.NODE_ENV || '', numCPUs));
    } catch (error) {
      console.log('=============ERROR OCCURRED==============');
      console.error(error);
    }
  }
})();
