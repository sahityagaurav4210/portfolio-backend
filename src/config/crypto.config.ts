import * as crypto from 'crypto';

let passphrase = "", salt = "", vector: Buffer;

export function getGlobalCryptoConfigs() {
  if (!passphrase)
    passphrase = process.env.PASSPHRASE || 'abc';
  if (!salt)
    salt = process.env.SALT || 'salt';
  if (!vector)
    vector = crypto.randomBytes(16);

  return { passphrase, salt, vector }
}