import { IDbId, ITimestamp } from '.';
import { OID } from '../types';

interface Signin {
  token: string;
  isLoggedIn?: boolean;
  loginAt: Date;
  logoutAt?: Date;
  access_token?: string;
}

export interface IUser extends ITimestamp, IDbId {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  password: string;
  websites?: string[];
}

export interface ILogins extends ITimestamp, IDbId {
  loggedInUser: OID;
  sessions: Signin[];
  phone: string;
}
