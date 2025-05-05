import { IFiles } from "@interfaces/files.interface";
import mongoose, { model, Schema } from "mongoose";
import { ModelNames } from "../constant";

const fileSchema = new Schema<IFiles>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: ModelNames.USERS, required: true, index: true },
  file_type: { type: String, required: true, trim: true, lowercase: true },
  url: { type: String, required: true, trim: true, unique: true },
  token: { type: String, required: true, trim: true, lowercase: true },
  is_active: { type: Boolean, default: false }
}, { timestamps: true })

const Files = model(ModelNames.FILES, fileSchema, ModelNames.FILES);

export { fileSchema, Files }