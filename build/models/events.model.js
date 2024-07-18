"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const mongoose_1 = require("mongoose");
const constant_1 = require("../constant");
const eventSchema = new mongoose_1.Schema({
    eventName: { type: String, required: [true, 'Event name is required'] },
    firedBy: {
        type: String,
        required: [true, 'Fired by is required'],
    },
}, { timestamps: true });
exports.Events = (0, mongoose_1.model)(constant_1.ModelNames.EVENTS, eventSchema);
