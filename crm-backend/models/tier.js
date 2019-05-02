const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PermissionObject = require("./commonPermission");
const tierSchema = new Schema({
    brandName: {
        type: String,
        default: null
    },
    modalName: {
        type: String,
        default: null
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
        default: null
    },
    seasonality: {
        type: String,
        default: null
    },
    tierSize: {
        type: [Object],
        default: null
    },
    tierPermission: {
        type: PermissionObject,
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
        default: null,
    },
});

module.exports = mongoose.model("Tier", tierSchema);
