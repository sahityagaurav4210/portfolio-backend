export enum ModelNames {
  EVENTS = 'events',
  USERS = 'users',
  LOGIN = 'logins',
  PORTFOLIO = 'portfolio',
  CONTRACT = 'contract',
}

export enum EventNames {
  SHUT_DOWN = 'shutdown',
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
