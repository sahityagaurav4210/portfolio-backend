"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = exports.Status = exports.HTTP_STATUS_CODES = exports.API_BASEURL = void 0;
exports.API_BASEURL = '/api/v1';
var HTTP_STATUS_CODES;
(function (HTTP_STATUS_CODES) {
    HTTP_STATUS_CODES[HTTP_STATUS_CODES["OK"] = 200] = "OK";
    HTTP_STATUS_CODES[HTTP_STATUS_CODES["CREATED"] = 201] = "CREATED";
    HTTP_STATUS_CODES[HTTP_STATUS_CODES["UPDATED"] = 202] = "UPDATED";
    HTTP_STATUS_CODES[HTTP_STATUS_CODES["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTP_STATUS_CODES[HTTP_STATUS_CODES["UNAUTHORISED"] = 401] = "UNAUTHORISED";
    HTTP_STATUS_CODES[HTTP_STATUS_CODES["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTP_STATUS_CODES[HTTP_STATUS_CODES["NOT_FOUND"] = 404] = "NOT_FOUND";
    HTTP_STATUS_CODES[HTTP_STATUS_CODES["CONFLICT"] = 409] = "CONFLICT";
    HTTP_STATUS_CODES[HTTP_STATUS_CODES["TOO_LARGE_REQ"] = 413] = "TOO_LARGE_REQ";
    HTTP_STATUS_CODES[HTTP_STATUS_CODES["INV_PAYLOAD"] = 422] = "INV_PAYLOAD";
    HTTP_STATUS_CODES[HTTP_STATUS_CODES["SERVER_ERR"] = 500] = "SERVER_ERR";
    HTTP_STATUS_CODES[HTTP_STATUS_CODES["UNAVAILABLE"] = 503] = "UNAVAILABLE";
})(HTTP_STATUS_CODES || (exports.HTTP_STATUS_CODES = HTTP_STATUS_CODES = {}));
var Status;
(function (Status) {
    Status["SUCCESS"] = "success";
    Status["ERROR"] = "error";
    Status["EXCEPTION"] = "exception";
    Status["VALIDATION"] = "validation";
    Status["CONFLICT"] = "already exists";
    Status["UNDEFINED"] = "not defined";
})(Status || (exports.Status = Status = {}));
class ApiResponse {
    status;
    message;
    data;
    entryBy;
    constructor(status = Status.UNDEFINED, message = '', data = null, entryBy = '127.0.0.1') {
        this.status = status;
        this.message = message;
        this.data = data;
        this.entryBy = entryBy;
    }
    get STATUS() {
        return this.status;
    }
    get MESSAGE() {
        return this.message;
    }
    get DATA() {
        return this.data;
    }
    get ENTRY_BY() {
        return this.entryBy;
    }
}
exports.ApiResponse = ApiResponse;
