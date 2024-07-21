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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exception_decorator_1 = require("../decorators/exception.decorator");
const users_model_1 = require("../models/users.model");
const login_model_1 = require("../models/login.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const api_1 = require("../api");
class LoginMiddleware {
    static async checkIfCredentialsAreCorrect(request, response, next) {
        let { phone, password } = request.body;
        let [userRecord, loginRecord] = await Promise.all([
            users_model_1.User.findOne({ phone }),
            login_model_1.Login.findOne({ phone }),
        ]);
        if (userRecord && (await bcrypt_1.default.compare(password, userRecord.password))) {
            request.userRecord = userRecord;
            request.loginRecord = loginRecord;
            return next();
        }
        const reply = new api_1.ApiResponse();
        reply.STATUS = api_1.Status.UNAUTHORISED;
        reply.MESSAGE = 'Invalid phone or password';
        reply.ENTRY_BY = phone;
        return response.status(api_1.HTTP_STATUS_CODES.UNAUTHORISED).json(reply);
    }
}
__decorate([
    (0, exception_decorator_1.HandleException)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], LoginMiddleware, "checkIfCredentialsAreCorrect", null);
exports.default = LoginMiddleware;
