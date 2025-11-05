import Seeders from "@db/seeders";
import { connect } from "./db";
import Scheduler from "@config/scheduler.config";

export default async function run() {
  const status = await connect(
    process.env.DATABASE_CONN_STRING || '',
    process.env.DATABASE_NAME || 'portfolio'
  );

  if (status.connected) {
    const seeders = new Seeders();

    await seeders.run();
    Scheduler.init();
  } else {
    console.log("==============ERROR CONNECTING TO DB================");
    process.exit(-1);
  }
}