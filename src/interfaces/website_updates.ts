import { IDbId, ITimestamp } from '.';
import { OID } from '../types';

export interface IWebsiteUpdates extends ITimestamp, IDbId {
  website_owner: OID;
  portfolio_url: string;
}
