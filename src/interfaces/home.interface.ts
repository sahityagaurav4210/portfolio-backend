import { IDbId, ITimestamp } from '.';

export interface IHome extends IDbId, ITimestamp {
  displayName: string;
  url?: string;
  specialization: Array<string>;
  about: string;
  projectsDelivered?: number;
  codingQuestionSolved?: number;
  experience?: number;
  activeGithubContributions?: number;
  user: IDbId;
  designation: string;
  hackerrankUrl?: string;
  leetcodeUrl?: string;
  linkedInUrl?: string;
  twitterUrl?: string;
  tags?: Array<string>;
}
