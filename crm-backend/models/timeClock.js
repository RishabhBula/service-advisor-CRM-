const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeClockSchema = new Schema({
    type: {
        type: String,
        default: null,
    },
    technicianId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
    vehicleId: {
        type: Schema.Types.ObjectId,
        ref: "vehicle",
        default: null
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        default: null
    },
    startDateTime: {
        type: Date,
        default: null
    },
    endDateTime: {
        type: Date,
        default: null
    },
    activity: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        default: null
    },
    duration: {
        type: String,
        default: null
    },
    note: {
        type: String,
        default: null
    },
    total: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: null,
    },
});

module.exports = mongoose.model("TimeClock", timeClockSchema);