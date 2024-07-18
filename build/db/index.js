"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
const mongoose_1 = __importDefault(require("mongoose"));
async function connect(connString, dbName) {
    const dbString = `${connString}${dbName}`;
    const { STATES } = await mongoose_1.default.connect(dbString);
    return STATES;
}
