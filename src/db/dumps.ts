import { User } from '../models/users.model';

const Admins = {
  name: 'Gaurav Sahitya',
  phone: '+916280706994',
  email: 'works.sahitya@gmail.com',
  password: '@Bc1034@porTfoLio!2024',
};

export async function createAdmin() {
  const existingAdmins = await User.find({});

  if (!existingAdmins.length) await User.create(Admins);
}
