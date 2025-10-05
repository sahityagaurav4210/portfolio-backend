import * as https from 'https';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { TokenExpiry, TokenSecrets } from '../constant';
import { Convert } from './convertibles.helper';
import Files from './files.helpers';
import { ValidationMessages } from './messages.helper';
import Crypto from '@config/crypto.config';
import Packages from '@packages/index';

export async function hashPwd(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashPwd = await bcrypt.hash(password, salt);
  return hashPwd;
}

export async function checkPwd(plainPwd: string, hashedPwd: string): Promise<boolean> {
  return await bcrypt.compare(plainPwd, hashedPwd);
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

export async function encrypt(data: string): Promise<string> {
  const passphrase = process.env.PASSPHRASE as string;
  const salt = process.env.SALT as string;
  const { vector } = await Crypto.getGlobalCryptoConfigs();

  const key = crypto.scryptSync(passphrase, salt, 32) as unknown as crypto.CipherKey;
  const cipher = crypto.createCipheriv('aes-256-cbc', key, vector.toString("hex"));
  let encryptedText = cipher.update(data, 'utf-8', 'hex');
  encryptedText += cipher.final('hex');

  return encryptedText;
}

export async function decrypt(encryptedText: string): Promise<string> {
  const passphrase = process.env.PASSPHRASE as string;
  const salt = process.env.SALT as string;
  const { vector } = await Crypto.getGlobalCryptoConfigs();

  const key = crypto.scryptSync(passphrase, salt, 32) as unknown as crypto.CipherKey;
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, new Uint8Array(vector));
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

export { Convert, ValidationMessages, Files };
