let passphrase = "", salt = "";

export function getGlobalCryptoConfigs() {
  if (!passphrase)
    passphrase = process.env.PASSPHRASE || 'abc';
  if (!salt)
    salt = process.env.SALT || 'salt';

  return { passphrase, salt }
}