import { OID } from '../types';

export interface IEvents {
  readonly _id: OID;
  eventName: string;
  firedBy: OID;
  createdAt?: Date;
  updatedAt?: Date;
}
