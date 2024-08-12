import { model, Schema } from 'mongoose';
import { IHiring } from '../interfaces/hiring.interface';
import { HiringType, ModelNames } from '../constant';

const Patterns = require('@book-junction/patterns');

const hiringSchema = new Schema<IHiring>(
  {
    client_name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Too short name'],
      match: [Patterns.common.name, 'Invalid name'],
      trim: true,
    },

    client_email: {
      type: String,
      required: [true, 'Email is required'],
      minlength: [5, 'Too short email'],
      trim: true,
      match: [Patterns.common.email, 'Invalid email address'],
    },

    client_project_name: {
      type: String,
      required: [true, 'Project name is required'],
      minlength: [2, 'Too short ptoject name'],
      trim: true,
    },

    tenure: {
      type: Number,
      default: 0,
    },

    hiring_type: {
      type: String,
      enum: HiringType,
      required: [true, 'Hiring type is required'],
      trim: true,
    },

    budget: {
      type: String,
      required: [true, 'Budget is required'],
      trim: true,
    },

    message: {
      type: String,
      required: [true, 'Invalid message'],
      trim: true,
    },

    ipAddress: {
      type: String,
      default: '0.0.0.0',
      trim: true,
    },
  },
  { timestamps: true }
);

export const Hiring = model(ModelNames.HIRING, hiringSchema);
