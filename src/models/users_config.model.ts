import { IUsersConfig } from '@interfaces/users_config.interface';
import { model, Schema } from 'mongoose';
import { ModelNames } from '../constant';

const userConfigSchema = new Schema<IUsersConfig>({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User Id is required'],
  },
  modifiedBy: {
    type: Schema.Types.ObjectId,
    required: [true, 'User Id is required'],
  },
  hasPwdChangedRecently: {
    type: Schema.Types.Boolean,
    default: false,
  },
});

const UserConfiguration = model(ModelNames.USER_CONFIG, userConfigSchema, ModelNames.USER_CONFIG);
export default UserConfiguration;
