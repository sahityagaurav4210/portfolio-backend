import { Request } from 'express';
import { OID } from '../types';

export interface ITimestamp {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDbId {
  readonly _id: OID;
}

export interface CustomReq extends Request {
  loginRecord?: any;
  userRecord?: any;
  authenticatedUser?: any;
}

export interface IToken {
  phone?: string;
}

export interface IClientToken {
  url: string;
}

export interface ICrypto extends IDbId, ITimestamp {
  vector: Buffer
}

export interface IPipe<T> {
  Convert(input: string): T;
}