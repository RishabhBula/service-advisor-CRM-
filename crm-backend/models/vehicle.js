const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    notes: {
        type: String,
        default: null,
    },
    year: {
        type: Number,
        default: null,
    },
    make: {
        type: String,
        default: null,
    },
    modal: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        default: null,
    },
    miles: {
        type: String,
        default: null,
    },
    color: {
        type: String,
        default: null,
    },
    licensePlate: {
        type: String,
        default: null,
    },
    unit: {
        type: String,
        default: null,
    },
    vin: {
        type: String,
        default: null,
    },
    subModal: {
        type: String,
        default: null,
    },
    engineSize: {
        type: String,
        default: null,
    },
    productionDate: {
        type: Date,
        default: null,
    },
    transmission: {
        type: String,
        default: null,
    },
    drivetrain: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("vehicle", vehicleSchema);
