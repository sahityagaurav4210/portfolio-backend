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
const api_1 = require("../api");
const events_model_1 = require("../models/events.model");
const constant_1 = require("../constant");
const exception_decorator_1 = require("../decorators/exception.decorator");
class HomeController {
    static ping(request, response) {
        const reply = new api_1.ApiResponse(api_1.Status.SUCCESS, 'Pong', { version: 'v1' }, request.ip || 'localhost');
        return response.status(api_1.HTTP_STATUS_CODES.OK).json(reply);
    }
    static async shutdown(request, response) {
        const { authenticatedUser } = request;
        const reply = new api_1.ApiResponse(api_1.Status.SUCCESS, 'Shutdown was successfull');
        await events_model_1.Events.create({ eventName: constant_1.EventNames.SHUT_DOWN, firedBy: authenticatedUser._id });
        response.status(api_1.HTTP_STATUS_CODES.OK).json(reply);
        process.exit(0);
    }
}
__decorate([
    (0, exception_decorator_1.HandleException)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], HomeController, "ping", null);
__decorate([
    (0, exception_decorator_1.HandleException)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HomeController, "shutdown", null);
exports.default = HomeController;
