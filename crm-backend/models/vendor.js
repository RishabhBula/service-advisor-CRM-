const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const vendorSchema = new Schema({
    name: {
        type: String,
        default: null
    },
    url: {
        type: String,
        default: null
    },
    accountNumber: {
        type: String,
        default: null
    },
    contactPerson: {
        type: Object,
        default: null
    },
    address: {
        type: Object,
        default: null
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    status: {
        type: Boolean,
        default: true
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
        default: Date.now,
    },
});

module.exports = mongoose.model("Vendor", vendorSchema);
