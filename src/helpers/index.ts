import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TokenExpiry, Tokens, TokenSecrets } from '../constant';

export async function hashPwd(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashPwd = await bcrypt.hash(password, salt);
  return hashPwd;
}

export function generateToken(phone: string, tokenType: Tokens): string {
  let token: string;
  const secret = TokenSecrets[tokenType] || '';

  token = jwt.sign({ phone }, secret, { expiresIn: TokenExpiry[tokenType] });

  return token;
}

export function generateXApiToken(data: string): string {
  const secret = TokenSecrets.XAPI || '';
  const x_api_key = jwt.sign({ data }, secret);

  return x_api_key;
}

export function decryptToken(token: string): jwt.JwtPayload | string {
  const tokenPayload = jwt.verify(token, TokenSecrets.REFRESH || '');
  return tokenPayload;
}

export function decryptXApiToken(token: string): jwt.JwtPayload | string {
  const tokenPayload = jwt.verify(token, TokenSecrets.XAPI || '');
  return tokenPayload;
}
