"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = __importDefault(require("../controllers"));
const middlewares_1 = __importDefault(require("../middlewares"));
const routes = (0, express_1.Router)();
routes.post('/login', middlewares_1.default.authentication().checkIfCredentialsAreCorrect, controllers_1.default.authentication().login);
routes.post('/logout', middlewares_1.default.checkIfAuthenticated, controllers_1.default.authentication().logout);
exports.default = routes;
