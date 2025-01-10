import { model, Schema } from 'mongoose';
import { ModelNames } from '../constant';
import { ILogs } from '@interfaces/logger.interface';

const logSchema = new Schema<ILogs>(
  {
    type: { type: String, default: null },
    logs: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

export const Logs = model(ModelNames.LOGS, logSchema);
