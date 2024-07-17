"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const EnvironmentVariables = require('@book-junction/env-loader');
const app = (0, express_1.default)();
EnvironmentVariables.LoadENV(['.env', '.env.development']);
app.use(express_1.default.json({ limit: '12kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '6kb' }));
app.use('/uploads', express_1.default.static(path_1.default.resolve(__dirname, '../uploads')));
app.use((0, cors_1.default)({ origin: process.env.ACCEPTED_CLIENTS }));
app.use('/api/v1', routes_1.default);
exports.default = app;
