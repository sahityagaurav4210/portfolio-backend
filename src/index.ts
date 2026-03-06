import 'dotenv/config';
import app from './app';
import { getAppDetails } from '@config/app.config';
import run from './server';
import Files from '@helpers/files.helpers';

import * as nodePath from 'node:path';

const PORT = Number.parseInt(process.env.PORT || '') || 8000;
const HOST = process.env.HOST || 'localhost';
const ENV = process.env.APP_ENV || 'local';

(async function () {
  await run();
  app.listen(PORT, HOST);

  const content = await Files.readFile(nodePath.resolve(__dirname, '../', 'banner.txt'));
  console.log(PORT);
  console.log(`\x1b[34m\x1b[1m${content.toString()}\x1b[0m`);
  console.log(`\x1b[32m\x1b[1m${getAppDetails(ENV)}\x1b[0m`);
})();
