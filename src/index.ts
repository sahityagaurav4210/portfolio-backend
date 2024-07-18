import app from './app';
import { connect } from './db';

const PORT = parseInt(process.env.PORT || '') || 8000;
const HOST = process.env.HOST || 'localhost';

(async function () {
  console.clear();
  const status = await connect(
    process.env.DATABASE_CONN_STRING || '',
    process.env.DATABASE_NAME || 'portfolio'
  );

  if (status.connected)
    app.listen(PORT, HOST, () => console.log(`Portfolio backend is running on port ${PORT}`));
  else console.error(`An error connecting with database.`);
})();
