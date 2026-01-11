import { IDbId, ITimestamp } from '.';
import { HiringType } from '../constant';

export interface IHiring extends IDbId, ITimestamp {
  client_name: string;
  client_project_name: string;
  client_email: string;
  tenure?: number;
  budget: string;
  hiring_type: HiringType;
  message: string;
  ipAddress: string;
  project_desc: string;
  terms: boolean;
  captchaId: string;
  isDeleted:boolean;
}
