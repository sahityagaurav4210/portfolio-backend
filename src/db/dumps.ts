import { getObject } from '@helpers/aws.helpers';
import { User } from '../models/users.model';

export async function createAdmin() {
  const existingAdmins = await User.find({});

  if (!existingAdmins.length) {
    const Admins = await getObject('portfolio-backend/admins.json');
    await User.create(Admins);
  }
}
