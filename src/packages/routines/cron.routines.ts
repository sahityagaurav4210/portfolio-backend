import { Events } from '@models/events.model';
import { EventNames } from '../../constant';
import path from 'node:path';
import Files from '@helpers/files.helpers';
import { Logs } from '@models/logger.model';

export async function syncEvents(): Promise<void> {
  const { REDIS_CLIENT } = globalThis as Record<string, any>;
  const { logger } = globalThis as Record<string, any>;
  const cachedWebViewEventKey = 'portfolio-backend:events:website-view-event';

  try {
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
    logger.info({ message: '[CRON I]: WEBSITE VIEW EVENT SYNCED' });
  } catch (error: any) {
    logger.error({ message: `Error Message: ${error.message}` });
    const eventName = `${EventNames.PORTFOLIO_WEBSITE_EVENT_SYNC_FAILED}\n Error Message: ${error.message}`;
    await Events.create({ eventName, firedBy: 'backend' });
  }
}

export async function saveLogs(): Promise<void> {
  const infoLogPath = path.resolve(__dirname, '../', 'logs/info.log');
  const errorLogPath = path.resolve(__dirname, '../', 'logs/error.log');

  const infoLogs = (await Files.readFile(infoLogPath))
    .toString()
    .split('\r\n')
    .filter(Boolean)
    .map((log: string) => JSON.parse(log));
  const errorLogs = (await Files.readFile(errorLogPath))
    .toString()
    .split('\r\n')
    .filter(Boolean)
    .map((log: string) => JSON.parse(log));

  if (infoLogs.length) await Logs.create({ type: 'info', logs: infoLogs });
  if (errorLogs.length) await Logs.create({ type: 'error', logs: errorLogs });

  await Files.createFile(infoLogPath, Buffer.from(''));
  await Files.createFile(errorLogPath, Buffer.from(''));
}
