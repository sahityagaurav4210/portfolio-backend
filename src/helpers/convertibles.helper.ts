import mongoose from 'mongoose';

export class Convert {
  public static toObjectId(item: string) {
    return new mongoose.Types.ObjectId(item);
  }
}
