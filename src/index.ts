import app from './app';

const PORT = parseInt(process.env.PORT || '') || 8000;
const HOST = process.env.HOST || 'localhost';

(async function () {
  console.clear();
  app.listen(PORT, HOST, () => console.log(`Portfolio backend is running on port ${PORT}`));
})();
