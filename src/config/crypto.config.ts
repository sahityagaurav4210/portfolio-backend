import * as crypto from 'crypto';

class Crypto {
  private static vector: Buffer;

  public static async getGlobalCryptoConfigs() {
    if (!this.vector) {
      this.vector = crypto.randomBytes(16);
    }

    return this.vector;
  }
}
export default Crypto;