import type { OID } from '../types';
import { IDbId, ITimestamp } from '.';

export interface IUsersConfig extends ITimestamp, IDbId {
  userId: OID;
  modifiedBy: OID;
  hasPwdChangedRecently: boolean;
}
