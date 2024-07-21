"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./db");
const dumps_1 = require("./db/dumps");
const PORT = parseInt(process.env.PORT || '') || 8000;
const HOST = process.env.HOST || 'localhost';
(async function () {
    try {
        console.clear();
        const status = await (0, db_1.connect)(process.env.DATABASE_CONN_STRING || '', process.env.DATABASE_NAME || 'portfolio');
        if (status.connected) {
            await (0, dumps_1.createAdmin)();
            app_1.default.listen(PORT, HOST, () => console.log(`Portfolio backend is running on port ${PORT}`));
        }
        else
            console.error(`An error connecting with database.`);
    }
    catch (error) {
        console.log('=============ERROR OCCURED==============');
        console.error(error);
    }
})();
