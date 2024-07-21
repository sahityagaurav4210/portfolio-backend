import { IDbId, ITimestamp } from '.';
import { OID } from '../types';

interface Signin {
  token: string;
  isLoggedIn?: boolean;
  loginAt: Date;
  logoutAt?: Date;
}

export interface IUser extends ITimestamp, IDbId {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  password: string;
}

export interface ILogins extends ITimestamp, IDbId {
  loggedInUser: OID;
  signins: Signin[];
  phone: string;
}
