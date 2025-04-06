import { getObject } from '@helpers/aws.helpers';
import { User } from '../models/users.model';

export async function createAdmin() {
  const existingAdmins = await User.find({});

  if (!existingAdmins.length) {
    const Admins = await getObject('portfolio-backend/admins.json');
    await User.create(Admins);
  }
}

export async function updateWebsites() {
  const existingAdmins = await User.findOne({ phone: process.env.USER_PHONE });

  if (!existingAdmins?.websites?.length) {
    existingAdmins?.websites?.push('https://www.sgaurav.me');
    await existingAdmins?.save();
  }
}
