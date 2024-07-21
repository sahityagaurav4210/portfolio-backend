"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = createAdmin;
const users_model_1 = require("../models/users.model");
const Admins = {
    name: 'Gaurav Sahitya',
    phone: '+916280706994',
    email: 'works.sahitya@gmail.com',
    password: '@Bc1034@porTfoLio!2024',
};
async function createAdmin() {
    const existingAdmins = await users_model_1.User.find({});
    if (!existingAdmins.length)
        await users_model_1.User.create(Admins);
}
