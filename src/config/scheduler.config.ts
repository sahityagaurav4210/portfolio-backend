import cron from 'node-cron';
import { CRON_EXPRESSIONS, EventNames } from '../constant';
import { Events } from '../models/events.model';

export default class Scheduler {
  public static websiteViewEventSyncher() {
    cron.schedule(CRON_EXPRESSIONS.EVERY_5_MIN, async () => {
      try {
        const { REDIS_CLIENT } = globalThis as Record<string, any>;
        const cachedWebViewEventKey = 'portfolio-backend:events:website-view-event';
        let rawEvents = await REDIS_CLIENT.get(cachedWebViewEventKey);
        rawEvents = rawEvents || JSON.stringify([]);
        let events = JSON.parse(rawEvents);

        if (events.length) {
          events = [
            ...events,
            { eventName: EventNames.PORTFOLIO_WEBSITE_EVENT_SYNC, firedBy: 'backend' },
          ];
          await Events.insertMany(events);
          await REDIS_CLIENT.del(cachedWebViewEventKey);
        }

        console.log('=======[CRON I]: WEBSITE VIEW EVENT SYNCED=======');
      } catch (error: any) {
        const eventName = `${EventNames.PORTFOLIO_WEBSITE_EVENT_SYNC_FAILED}\n Error Message: ${error.message}`;
        await Events.create({ eventName, firedBy: 'backend' });
      }
    });
  }
}
