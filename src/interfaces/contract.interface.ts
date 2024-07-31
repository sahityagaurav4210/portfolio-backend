import { IDbId, ITimestamp } from '.';

export interface IContract extends ITimestamp, IDbId {
  first_name: string;
  last_name?: string;
  email: string;
  message: string;
  ipAddress: string;
}
