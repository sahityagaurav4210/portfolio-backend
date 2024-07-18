"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../api");
const events_model_1 = require("../models/events.model");
const constant_1 = require("../constant");
class HomeController {
    static ping(request, response) {
        const reply = new api_1.ApiResponse(api_1.Status.SUCCESS, 'Pong', { version: 'v1' }, request.ip || 'localhost');
        return response.status(api_1.HTTP_STATUS_CODES.OK).json(reply);
    }
    static async shutdown(request, response) {
        const reply = new api_1.ApiResponse(api_1.Status.SUCCESS, 'Shutdown was successfull');
        await events_model_1.Events.create({ eventName: constant_1.EventNames.SHUT_DOWN, firedBy: 'admin' });
        response.status(api_1.HTTP_STATUS_CODES.OK).json(reply);
        process.exit(0);
    }
}
exports.default = HomeController;
