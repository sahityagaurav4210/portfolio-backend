import { IDbId, ITimestamp } from ".";

export interface IFiles extends IDbId, ITimestamp {
  userId: IDbId;
  file_type: string;
  url: string;
  token: string;
  is_active: boolean;
  websites: string[];
}

export interface IUploadResumeDTO {
  websites: string[];
}