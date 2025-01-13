import { invalidateCachedAWSObjects, saveLogs, syncEvents } from './routines/cron.routines';

class Packages {
  public static get routines() {
    return { cron: { syncEvents, saveLogs, invalidateCachedAWSObjects } };
  }
}

export default Packages;
