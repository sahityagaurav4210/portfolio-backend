import Seeders from "@db/seeders";
import { connect } from "./db";
import Scheduler from "@config/scheduler.config";

export default async function run() {
  try {
    await connect(process.env.DATABASE_CONN_STRING || '', process.env.DATABASE_NAME || 'portfolio');
    const seeders = new Seeders();

    await seeders.run();
    Scheduler.init();
  } catch (error) {
    console.log("========================ERROR CONNECTING IN DATABASE============================");
    console.error(error);
    process.exit(-1);
  }
}