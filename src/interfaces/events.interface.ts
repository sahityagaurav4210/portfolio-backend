import { OID } from '../types';

export interface IEvents {
  readonly _id: OID;
  eventName: string;
  firedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
