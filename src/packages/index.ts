import { saveLogs, syncEvents } from './routines/cron.routines';

class Packages {
  public static get routines() {
    return { cron: { syncEvents, saveLogs } };
  }
}

export default Packages;
