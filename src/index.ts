import 'dotenv/config';

import S3 from '@config/aws.config';
import app from './app';
import connectRedis from '@config/redis.config';
import Scheduler from '@config/scheduler.config';
import { connect } from '@db/index';
import { createAdmin } from '@db/dumps';

const PORT = parseInt(process.env.PORT || '') || 8000;
const HOST = process.env.HOST || 'localhost';

(async function () {
  try {
    const status = await connect(
      process.env.DATABASE_CONN_STRING || '',
      process.env.DATABASE_NAME || 'portfolio'
    );

    if (status.connected) {
      (globalThis as Record<string, any>).AWS_S3 = S3;
      await createAdmin();
      const client = connectRedis();
      (globalThis as Record<string, any>).REDIS_CLIENT = client;

      Scheduler.init();

      app.listen(PORT, HOST, () => console.log(`Portfolio backend is running on port ${PORT}`));
    } else console.error(`An error connecting with database.`);
  } catch (error) {
    console.log('=============ERROR OCCURRED==============');
    console.error(error);
  }
})();
