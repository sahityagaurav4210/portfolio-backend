import { Events } from '@models/events.model';
import { EventNames } from 'src/constant';

export async function syncEvents() {
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
}
