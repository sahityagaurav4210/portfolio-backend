import { ICrypto } from "@interfaces/index";
import { model, Schema } from "mongoose";
import { ModelNames } from "../constant";

const cryptoSchema = new Schema<ICrypto>({ vector: { type: Buffer } },
  { timestamps: true }
);

const CryptoModel = model(ModelNames.CRYPTO, cryptoSchema, ModelNames.CRYPTO);
export default CryptoModel;