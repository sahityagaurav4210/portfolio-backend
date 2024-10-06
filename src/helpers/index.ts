import * as https from 'https';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { TokenExpiry, Tokens, TokenSecrets } from '../constant';
import { Convert } from './convertibles.helper';
import Files from './files.helpers';
import { ValidationMessages } from './messages.helper';

const vector = crypto.randomBytes(16);
const passphrase = process.env.PASSPHRASE || 'abc';
const salt = process.env.SALT || 'salt';

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

export function encrypt(data: string): string {
  const key = crypto.scryptSync(passphrase, salt, 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, vector);
  let encryptedText = cipher.update(data, 'utf-8', 'hex');
  encryptedText += cipher.final('hex');

  return encryptedText;
}

export function decrypt(encryptedText: string): string {
  const key = crypto.scryptSync(passphrase, salt, 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(vector));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export async function getCVBlob(url: string): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    https.get(url, res => {
      res.setEncoding('binary');
      let blob: Array<Buffer> = [];

      res.on('data', chunk => {
        blob.push(Buffer.from(chunk, 'binary'));
      });

      res.on('end', () => {
        if (!blob.length) reject(Buffer.from('No response'));
        resolve(Buffer.concat(blob));
      });
    });
  });
}

export { Convert, ValidationMessages, Files };
