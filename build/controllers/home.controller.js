"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../api");
class HomeController {
    static ping(request, response) {
        const reply = new api_1.ApiResponse(api_1.Status.SUCCESS, 'Pong', { version: 'v1' }, request.ip || 'localhost');
        return response.status(api_1.HTTP_STATUS_CODES.OK).json(reply);
    }
}
exports.default = HomeController;
