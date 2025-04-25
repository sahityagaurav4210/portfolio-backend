import { IDbId, ITimestamp } from ".";

export interface IPageStatus extends IDbId, ITimestamp {
  url: string;
  status: boolean;
}