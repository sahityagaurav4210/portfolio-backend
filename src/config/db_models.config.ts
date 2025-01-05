import { QueryOptions } from "mongoose";

export function modelUpdateObject(): QueryOptions {
    return { new: true, runValidators: true }
}