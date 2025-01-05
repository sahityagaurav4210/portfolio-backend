import mongoose, { Document, Model, Schema } from 'mongoose';

export type OID = mongoose.Schema.Types.ObjectId;
export type DBType<T> = Model<T, {}, {}, {}, Document<unknown, {}, T> & T & Required<{
    _id: Schema.Types.ObjectId;
}>>;
