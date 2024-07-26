import { IDbId, ITimestamp } from '.';
import { OID } from '../types';

interface IHome {
  profilePic?: string;
  description: string;
}

interface IProjects {
  name: string;
  description: string;
  tech_stack: string[];
  live_link?: string;
  code_link: string;
  documentation_link?: string;
}

export interface IPortfolio extends ITimestamp, IDbId {
  homeSection: IHome;
  projectSection: IProjects[];
  portfolio_user: OID;
}
