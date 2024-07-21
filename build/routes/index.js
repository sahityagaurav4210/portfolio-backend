"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_route_1 = __importDefault(require("./home.route"));
const login_route_1 = __importDefault(require("./login.route"));
const route = (0, express_1.Router)();
route.use(home_route_1.default);
route.use('/authentication', login_route_1.default);
exports.default = route;
