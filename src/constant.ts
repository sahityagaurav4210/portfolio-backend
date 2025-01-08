export enum ModelNames {
  EVENTS = 'events',
  USERS = 'users',
  LOGIN = 'logins',
  PORTFOLIO = 'portfolio',
  CONTRACT = 'contract',
  HIRING = 'hire_me',
  WEBSITE_UPDATES = 'website_updates',
}

export enum EventNames {
  SHUT_DOWN = 'shutdown',
  CLIENT_ACCESS_TOKEN_GEN = 'client access token generated',
  ACCESS_TOKEN_REFRESHED = 'admin access token re-generated',
  CLIENT_ACCESS_TOKEN_REGEN = 'client access token re-generated',
  SINGLE_PORTFOLIO_FETCHED = 'portfolio of :portfolio_user was viewed',
  ALL_PORTFOLIO_FETCHED = 'portfolio list was viewed',
  PORTFOLIO_EDITED = 'portfolio of :portfolioId was edited',
  PORTFOLIO_CREATED = 'a new portfolio was created',
  PORTFOLIO_WEBSITE_VIEWED = 'portfolio website was viewed',
  PORTFOLIO_WEBSITE_EVENT_SYNC = 'portfolio website event synced',
  PORTFOLIO_WEBSITE_EVENT_SYNC_FAILED = 'portfolio website event sync failed',
  PORTFOLIO_WEBSITE_VIEW_FETCHED = 'portfolio website view fetched',
  PORTFOLIO_WEBSITE_TOTAL_VIEWS_FETCHED = 'portfolio website total views fetched',
  PORTFOLIO_FETCHED_BY_CLIENT = 'client viewed his portfolio',
}

export enum Environments {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export enum HiringType {
  PART_TIME = 'part time',
  FULL_TIME = 'full time',
}

export enum CRON_EXPRESSIONS {
  EVERY_5_MIN = '*/5 * * * *',
}

export enum ProjectType {
  PERSONAL = 'personal',
  PROFESSIONAL = 'professional',
}

export const TokenExpiry = {
  ACCESS: process.env.ACCESS_TOKEN_EXP,
  REFRESH: process.env.REF_TOKEN_EXP,
  XAPI: process.env.X_API_EXP,
};

export const TokenSecrets = {
  ACCESS: process.env.ACCESS_TOKEN_SEC,
  REFRESH: process.env.REFRESH_TOKEN_SEC,
  XAPI: process.env.X_API_SEC,
};

export enum Tokens {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  XAPI = 'XAPI',
}

export const CLIENT_URL = 'https://gaurav-sahitya.netlify.app';
