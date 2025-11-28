import 'dotenv/config';
import app from './app';
import { getAppDetails } from '@config/app.config';
import run from './server';
import Files from '@helpers/files.helpers';

import * as nodePath from "node:path";

const PORT = parseInt(process.env.PORT || '') || 8000;
const HOST = process.env.HOST || 'localhost';

(async function () {
  await run();
  app.listen(PORT, HOST);

  const content = await Files.readFile(nodePath.resolve(__dirname, "../", "banner.txt"));
  console.log(content.toString());
  console.table(getAppDetails(PORT, HOST, process.env.NODE_ENV || ''));
})();
