import mongoose from 'mongoose';

export async function connect(connString: string, dbName: string): Promise<void> {
  const dbString = `${connString}${dbName}`;
  await mongoose.connect(dbString, { connectTimeoutMS: 10000, serverSelectionTimeoutMS: 10000 });
}
