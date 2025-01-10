import { IDbId, ITimestamp } from '.';

export interface ILogs extends IDbId, ITimestamp {
  type: string;
  logs: Array<Record<string, any>>;
}
