import mongoose, { model, Schema } from 'mongoose';
import { ILogins } from '../interfaces/users.interface';
import { ModelNames } from '../constant';

const loginSchema = new Schema<ILogins>(
  {
    loggedInUser: {
      type: mongoose.Schema.ObjectId,
      ref: ModelNames.USERS,
      required: [true, 'Logged in user is required'],
    },
    signins: {
      type: [
        {
          token: { type: String, required: ['Token is required'] },
          isLoggedIn: { type: Boolean, default: false },
          loginAt: { type: Date, required: ['Login At is required'] },
          logoutAt: { type: Date, default: null },
        },
      ],
      _id: false,
      required: [true, 'Sign in is required'],
    },
    phone: { type: String, required: [true, 'Phone is required'] },
  },
  { timestamps: true }
);

export const Login = model(ModelNames.LOGIN, loginSchema);
