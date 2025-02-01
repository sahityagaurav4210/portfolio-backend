import CryptoModel from '@models/crypto.model';
import * as crypto from 'crypto';


class Crypto {
  private static vector: Buffer;

  public static async getGlobalCryptoConfigs() {
    const vectorRecord = await CryptoModel.findOne();

    if (!vectorRecord) {
      this.vector = crypto.randomBytes(16);
      await CryptoModel.create({ vector: this.vector });
    }
    else this.vector = vectorRecord.vector;
    return { vector: this.vector }
  }
}
export default Crypto;