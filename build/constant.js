"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokens = exports.TokenSecrets = exports.TokenExpiry = exports.EventNames = exports.ModelNames = void 0;
var ModelNames;
(function (ModelNames) {
    ModelNames["EVENTS"] = "events";
    ModelNames["USERS"] = "users";
    ModelNames["LOGIN"] = "logins";
})(ModelNames || (exports.ModelNames = ModelNames = {}));
var EventNames;
(function (EventNames) {
    EventNames["SHUT_DOWN"] = "shutdown";
})(EventNames || (exports.EventNames = EventNames = {}));
exports.TokenExpiry = {
    ACCESS: process.env.ACCESS_TOKEN_EXP,
    REFRESH: process.env.REF_TOKEN_EXP,
};
exports.TokenSecrets = {
    ACCESS: process.env.ACCESS_TOKEN_SEC,
    REFRESH: process.env.REFRESH_TOKEN_SEC,
};
var Tokens;
(function (Tokens) {
    Tokens["ACCESS"] = "ACCESS";
    Tokens["REFRESH"] = "REFRESH";
})(Tokens || (exports.Tokens = Tokens = {}));
