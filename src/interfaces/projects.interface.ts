import { IDbId, ITimestamp } from '.';
import { ProjectDomain, ProjectType } from '../constant';
import { OID } from '../types';

export interface IProject extends ITimestamp, IDbId {
  name: string;
  text: string;
  tech_stack: string[];
  type: ProjectType;
  disabled?: boolean;
  ongoing?: boolean;
  showDivider?: boolean;
  cardImage?: string;
  liveLink?: string;
  codeLink?: string;
  documentation_link?: string;
  user: OID;
  isActive?: boolean;
  priority?: number;
  projectDomain?: ProjectDomain;
  note?: string;
}

export type IProjectCreateDTO = Omit<IProject, '_id' | 'createdAt' | 'updatedAt'>;
export type IProjectUpdateDTO = Partial<IProjectCreateDTO>;
