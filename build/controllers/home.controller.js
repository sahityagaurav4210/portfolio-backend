"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HomeController {
    static ping(request, response) {
        return response.status(200).json({
            messsage: 'Pong',
        });
    }
}
exports.default = HomeController;
