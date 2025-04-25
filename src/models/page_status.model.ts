import { IPageStatus } from "@interfaces/page_status.interface";
import { model, Schema } from "mongoose";
import { ModelNames } from "../constant";

const pageStatusSchema = new Schema<IPageStatus>({
  url: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  status: { type: Boolean, default: true }
}, { timestamps: true });

export const PageStatus = model(ModelNames.PAGE_STATUS, pageStatusSchema, ModelNames.PAGE_STATUS);