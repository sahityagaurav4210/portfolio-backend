import mongoose, { ConnectionStates } from 'mongoose';

export async function connect(
  connString: string,
  dbName: string
): Promise<typeof ConnectionStates> {
  const dbString = `${connString}${dbName}`;
  const { STATES } = await mongoose.connect(dbString);

  return STATES;
}
