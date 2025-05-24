import BooleanPipe from './pipes/BooleanPipe';
import { invalidateCachedAWSObjects, saveLogs, syncEvents } from './routines/cron.routines';

class Packages {
  public static get routines() {
    return { cron: { syncEvents, saveLogs, invalidateCachedAWSObjects } };
  }

  public static get pipes() {
    return { BooleanPipe };
  }
}

export default Packages;
