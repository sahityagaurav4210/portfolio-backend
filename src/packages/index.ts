import { syncEvents } from './routines/cron.routines';

class Packages {
  public static get routines() {
    return { cron: { syncEvents } };
  }
}

export default Packages;
