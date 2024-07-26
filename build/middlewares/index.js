"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_middleware_1 = __importDefault(require("./login.middleware"));
const exception_decorator_1 = require("../decorators/exception.decorator");
const jwt = __importStar(require("jsonwebtoken"));
const users_model_1 = require("../models/users.model");
const api_1 = require("../api");
const login_model_1 = require("../models/login.model");
class Middleware {
    static authentication() {
        return login_middleware_1.default;
    }
    static async checkIfAuthenticated(request, response, next) {
        const { cookies } = request;
        const reply = new api_1.ApiResponse();
        const authorization = cookies.authorization;
        if (!authorization) {
            reply.STATUS = api_1.Status.VALIDATION;
            reply.MESSAGE = 'Token is required';
            return response.status(api_1.HTTP_STATUS_CODES.BAD_REQUEST).json(reply);
        }
        const tokenPayload = jwt.verify(authorization, process.env.ACCESS_TOKEN_SEC || '');
        if (typeof tokenPayload !== 'string') {
            const [userRecord, loginRecord] = await Promise.all([
                users_model_1.User.findOne({ phone: tokenPayload.phone }),
                login_model_1.Login.findOne({ $and: [{ phone: tokenPayload.phone }, { 'signins.isLoggedIn': true }] }),
            ]);
            if (!userRecord || !loginRecord) {
                reply.STATUS = api_1.Status.UNAUTHORISED;
                reply.MESSAGE = 'Invalid token';
                return response.status(api_1.HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
            }
            request.authenticatedUser = userRecord;
        }
        return next();
    }
}
__decorate([
    (0, exception_decorator_1.HandleException)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], Middleware, "checkIfAuthenticated", null);
exports.default = Middleware;
