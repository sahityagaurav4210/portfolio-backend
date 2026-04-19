import { CookieOptions } from 'express';

export function getCookieOptions(isSecureCookie: boolean, time: number): CookieOptions {
  return {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: isSecureCookie ? 'strict' : 'lax',
    maxAge: time,
    path: '/api/v1/',
  };
}

export function getNonHttpOnlyCookieOptions(isSecureCookie: boolean, time: number): CookieOptions {
  return {
    httpOnly: false,
    sameSite: isSecureCookie ? 'strict' : 'lax',
    maxAge: time,
    path: '/',
  };
}
