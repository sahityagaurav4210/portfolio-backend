import * as https from 'node:https';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'node:crypto';
import { Environments, TokenExpiry, TokenSecrets } from '../constant';
import Packages from '@packages/index';
import { Request, Response, NextFunction } from 'express';

export * from './messages.helper';
export * from './files.helpers';

export async function hashPwd(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashPwd = await bcrypt.hash(password, salt);
  return hashPwd;
}

export async function checkPwd(plainPwd: string, hashedPwd: string): Promise<boolean> {
  return await bcrypt.compare(plainPwd, hashedPwd);
}

export function getRandomSecureString(length: number): string {
  return crypto.randomBytes(length).toString('hex');
}

export function generateToken(phone: string, tokenType: keyof typeof TokenSecrets): string {
  let token: string;
  const secret = TokenSecrets[tokenType] || '';

  token = jwt.sign({ phone }, secret, { expiresIn: TokenExpiry[tokenType] });

  return token;
}

export function generateXApiToken(data: string, authUserId: string): string {
  const secret = TokenSecrets.XAPI || '';
  const x_api_key = jwt.sign({ data, userId: authUserId }, secret);

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

export function encrypt(plainText: string): string {
  const passphrase = process.env.PASSPHRASE as string;
  const salt = process.env.SALT as string;

  const iv = crypto.randomBytes(12);
  const key = crypto.scryptSync(passphrase, salt, 32);

  const cipher = crypto.createCipheriv('aes-256-ocb', new Uint8Array(key), new Uint8Array(iv), {
    authTagLength: 16,
  });

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return iv.toString('hex') + authTag.toString('hex') + encrypted;
}

export function decrypt(encryptedPayload: string): string {
  const passphrase = process.env.PASSPHRASE as string;
  const salt = process.env.SALT as string;

  const ivHex = encryptedPayload.slice(0, 24);
  const authTagHex = encryptedPayload.slice(24, 56);
  const encryptedText = encryptedPayload.slice(56);

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const key = crypto.scryptSync(passphrase, salt, 32);

  const decipher = crypto.createDecipheriv('aes-256-ocb', new Uint8Array(key), new Uint8Array(iv), {
    authTagLength: 16,
  });

  decipher.setAuthTag(new Uint8Array(authTag));

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export async function getCVBlob(url: string): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    https.get(url, res => {
      res.setEncoding('binary');
      const blob: Buffer[] = [];

      res.on('data', chunk => {
        blob.push(Buffer.from(chunk, 'binary'));
      });

      res.on('end', () => {
        if (!blob.length) reject(Buffer.from('No response'));
        resolve(Buffer.concat(blob as readonly Uint8Array[]));
      });
    });
  });
}

export async function performParallelTask(tasks: Array<Promise<any>>): Promise<any> {
  let taskResults = await Promise.allSettled(tasks);
  taskResults = taskResults
    .filter(result => result.status === 'fulfilled')
    .map(fulfilledResult => fulfilledResult.value)
    .filter(Boolean);

  return taskResults;
}

export function parseQsAsBoolean(input: string): boolean {
  const { BooleanPipe } = Packages.pipes;
  const booleanPipe = new BooleanPipe();

  return booleanPipe.Convert(input);
}

export function getTextCount(text: string): number {
  const charLen = text.split('').filter(char => char && char != '\n' && char !== ' ').length;
  return charLen;
}

export const asyncHandler =
  (
    fn: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => void | Response | Promise<void | Record<string, any>>
  ) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export function getChangePwdLink(appEnvironment: string): string {
  const relativeLink = '/auth/change-pwd';
  let absoluteLink: string;
  let baseUrl: string;

  switch (appEnvironment) {
    case Environments.LOCAL:
      absoluteLink = `http://localhost:5173${relativeLink}`;
      break;

    case Environments.DEVELOPMENT:
      baseUrl = process.env.DEVELOPMENT_URL || 'https://portfolio-dev-admin.codingworks.in';
      absoluteLink = `${baseUrl}${relativeLink}`;
      break;

    case Environments.PRODUCTION:
      baseUrl = process.env.PRODUCTION_URL || 'https://pbcms.codingworks.in';
      absoluteLink = `${baseUrl}${relativeLink}`;
      break;

    default:
      absoluteLink = `http://localhost:5173${relativeLink}`;
      break;
  }

  return absoluteLink;
}

export function getAcceptedHeaders(): string[] {
  const headers = process.env.ACCEPTED_HEADERS || '';

  if (!headers) return ['Content-Type', 'Authorization'];

  return headers.split(',').map(header => header.trim());
}

export function getUpdatedProfileLink(appEnvironment: string): string {
  const relativeLink = '/public/updated-profile';
  let absoluteLink: string;
  let baseUrl: string;

  switch (appEnvironment) {
    case Environments.LOCAL:
      absoluteLink = `http://localhost:5173${relativeLink}`;
      break;

    case Environments.DEVELOPMENT:
      baseUrl = process.env.DEVELOPMENT_URL || 'https://portfolio-dev-admin.codingworks.in';
      absoluteLink = `${baseUrl}${relativeLink}`;
      break;

    case Environments.PRODUCTION:
      baseUrl = process.env.PRODUCTION_URL || 'https://pbcms.codingworks.in';
      absoluteLink = `${baseUrl}${relativeLink}`;
      break;

    default:
      absoluteLink = `http://localhost:5173${relativeLink}`;
      break;
  }

  return absoluteLink;
}
