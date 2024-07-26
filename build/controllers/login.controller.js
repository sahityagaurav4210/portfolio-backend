"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_model_1 = require("../models/login.model");
const helpers_1 = require("../helpers");
const constant_1 = require("../constant");
const api_1 = require("../api");
const exception_decorator_1 = require("../decorators/exception.decorator");
class LoginController {
    static async login(request, response) {
        const { phone } = request.body;
        let { loginRecord, userRecord } = request;
        const reply = new api_1.ApiResponse();
        const access_token = (0, helpers_1.generateToken)(phone, constant_1.Tokens.ACCESS);
        const refresh_token = (0, helpers_1.generateToken)(phone, constant_1.Tokens.REFRESH);
        const signins = { token: refresh_token, isLoggedIn: true, loginAt: new Date() };
        if (loginRecord) {
            loginRecord.signins.push(signins);
            loginRecord.updatedAt = new Date();
            await loginRecord.save();
        }
        else {
            loginRecord = await login_model_1.Login.create({
                phone,
                loggedInUser: userRecord,
                signins: [signins],
            });
        }
        reply.STATUS = api_1.Status.SUCCESS;
        reply.MESSAGE = 'Login successfull';
        reply.DATA = { access_token, refresh_token, phone };
        reply.ENTRY_BY = phone;
        response.cookie('authorization', access_token, { httpOnly: true, secure: true });
        return response.status(api_1.HTTP_STATUS_CODES.OK).json(reply);
    }
    static async logout(request, response) {
        const { authenticatedUser } = request;
        const { refreshtoken } = request.headers;
        const reply = new api_1.ApiResponse();
        const { _id } = authenticatedUser;
        const user = await login_model_1.Login.findOne({ loggedInUser: _id });
        if (user) {
            for (let index = 0; index < user.signins.length; index++) {
                if (user.signins[index].token === refreshtoken) {
                    user.signins[index].logoutAt = new Date();
                    user.signins[index].isLoggedIn = false;
                    break;
                }
            }
            await user?.save();
            reply.STATUS = api_1.Status.SUCCESS;
            reply.MESSAGE = 'Logout successfull';
            reply.DATA = user;
            reply.ENTRY_BY = authenticatedUser.phone;
            return response.status(api_1.HTTP_STATUS_CODES.OK).json(reply);
        }
        else {
            reply.STATUS = api_1.Status.VALIDATION;
            reply.MESSAGE = 'Invalid user';
            reply.ENTRY_BY = authenticatedUser.phone;
            return response.status(api_1.HTTP_STATUS_CODES.OK).json(reply);
        }
    }
}
__decorate([
    (0, exception_decorator_1.HandleException)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LoginController, "login", null);
__decorate([
    (0, exception_decorator_1.HandleException)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LoginController, "logout", null);
exports.default = LoginController;
