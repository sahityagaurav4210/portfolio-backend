import cron from 'node-cron';
import { CRON_EXPRESSIONS } from '../constant';
import Packages from '@packages/index';

export default class Scheduler {
  public static init() {
    const { syncEvents, saveLogs } = Packages.routines.cron;

    cron.schedule(CRON_EXPRESSIONS.EVERY_5_MIN, syncEvents);
    cron.schedule(CRON_EXPRESSIONS.EVERY_6_MIN, saveLogs);
  }
}
