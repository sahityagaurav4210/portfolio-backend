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
