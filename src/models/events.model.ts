import mongoose, { model, Schema } from 'mongoose';
import { IEvents } from '../interfaces/events.interface';
import { ModelNames } from '../constant';

const eventSchema = new Schema<IEvents>(
  {
    eventName: { type: String, required: [true, 'Event name is required'] },
    firedBy: {
      type: mongoose.Schema.ObjectId,
      ref: ModelNames.USERS,
      required: [true, 'Fired by is required'],
    },
  },
  { timestamps: true }
);

export const Events = model(ModelNames.EVENTS, eventSchema);
