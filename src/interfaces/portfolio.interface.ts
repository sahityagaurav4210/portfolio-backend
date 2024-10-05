import { IDbId, ITimestamp } from '.';
import { ProjectType } from '../constant';
import { OID } from '../types';

export interface IHome {
  profilePic?: string;
  description: string;
}

export interface IProjects {
  name: string;
  description: string;
  tech_stack: string[];
  project_type: ProjectType;
  live_link?: string;
  code_link?: string;
  documentation_link?: string;
  disabled?: boolean;
}

export interface IPortfolio extends ITimestamp, IDbId {
  homeSection: IHome;
  projectSection: IProjects[];
  portfolio_user: OID;
}
