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
      minlength: [2, 'Too short project name'],
      maxLength: [255, 'Too long project name'],
      trim: true,
    },

    tenure: {
      type: Number,
      default: 0,
      max: Number.MAX_SAFE_INTEGER - 1,
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
      minLength: 1,
      maxLength: 255,
    },

    message: {
      type: String,
      required: [true, 'Invalid message'],
      trim: true,
      minLength: 10,
    },

    ipAddress: {
      type: String,
      default: '0.0.0.0',
      trim: true,
      match: [
        /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/,
        'Invalid ip address',
      ],
    },

    project_desc: {
      type: String,
      trim: true,
      required: [true, 'Project description is required'],
      minLength: 10,
      maxLength: 255,
    },

    terms: {
      type: Boolean,
      required: [true, 'Client confirmation is required'],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Hiring = model(ModelNames.HIRING, hiringSchema, ModelNames.HIRING);
