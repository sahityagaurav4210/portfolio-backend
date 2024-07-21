import app from './app';
import { connect } from './db';
import { createAdmin } from './db/dumps';

const PORT = parseInt(process.env.PORT || '') || 8000;
const HOST = process.env.HOST || 'localhost';

(async function () {
  try {
    console.clear();
    const status = await connect(
      process.env.DATABASE_CONN_STRING || '',
      process.env.DATABASE_NAME || 'portfolio'
    );

    if (status.connected) {
      await createAdmin();
      app.listen(PORT, HOST, () => console.log(`Portfolio backend is running on port ${PORT}`));
    } else console.error(`An error connecting with database.`);
  } catch (error) {
    console.log('=============ERROR OCCURED==============');
    console.error(error);
  }
})();
