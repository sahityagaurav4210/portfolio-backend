import { model, Schema } from 'mongoose';
import { IContract } from '../interfaces/contract.interface';
import { ModelNames } from '../constant';

const Patterns = require('@book-junction/patterns');

const contractSchema = new Schema<IContract>(
  {
    first_name: {
      type: String,
      required: [true, 'First name is required'],
      match: [Patterns.common.name, 'Invalid first name'],
    },
    last_name: { type: String, default: null, match: [Patterns.common.name, 'Invalid last name'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      index: true,
      trim: true,
      lowercase: true,
      minlength: [5, 'Email is too short'],
      match: [Patterns.common.email, 'Invalid email'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message is too short'],
      maxLength: [255, 'Message is too long'],
      trim: true,
    },
    ipAddress: {
      type: String,
      required: [true, 'Ip address is required'],
    },
  },
  { timestamps: true }
);

const Contract = model(ModelNames.CONTRACT, contractSchema, ModelNames.CONTRACT);
export default Contract;
