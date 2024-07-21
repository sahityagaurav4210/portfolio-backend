"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleException = HandleException;
const api_1 = require("../api");
function HandleException() {
    return function (target, propertyKey, descriptor) {
        let originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const response = args.find(arg => typeof arg === 'object' &&
                typeof arg.status === 'function' &&
                typeof arg.json === 'function' &&
                typeof arg.send === 'function');
            try {
                return await originalMethod.apply(this, args);
            }
            catch (error) {
                const reply = new api_1.ApiResponse(api_1.Status.EXCEPTION, error.message || 'An error occured');
                return response.status(api_1.HTTP_STATUS_CODES.SERVER_ERR).json(reply);
            }
        };
        return descriptor;
    };
}
