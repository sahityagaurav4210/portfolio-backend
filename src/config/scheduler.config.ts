import cron from 'node-cron';
import { CRON_EXPRESSIONS, EventNames } from '../constant';
import { Events } from '../models/events.model';
import Packages from '@packages/index';

export default class Scheduler {
  public static init() {
    cron.schedule(CRON_EXPRESSIONS.EVERY_5_MIN, Packages.routines.cron.syncEvents);
  }
}
