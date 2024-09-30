import { model, Schema } from 'mongoose';
import { IUser } from '../interfaces/users.interface';
import { ModelNames } from '../constant';
import { hashPwd } from '../helpers';

const Patterns = require('@book-junction/patterns');

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Name is too short'],
      maxlength: [32, 'Name is too long'],
      match: [Patterns.common.name, 'Invalid name'],
    },
    email: {
      type: String,
      default: null,
      unique: true,
      minlength: [5, 'Email is too short'],
      maxlength: [100, 'Email is too long'],
      match: [Patterns.common.email, 'Invalid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      minlength: [10, 'Phone is too short'],
      maxlength: [16, 'Phone is too large'],
      unique: true,
      index: true,
      match: [Patterns.common.phone, 'Invalid phone'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password is too short'],
      maxlength: [100, 'Password is too long.'],
    },
    address: {
      type: String,
      default: null,
      minlength: [10, 'Address is too short'],
      maxlength: [100, 'Address is too long'],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPwd(this.password);
  }
  next();
});

export const User = model(ModelNames.USERS, userSchema);
