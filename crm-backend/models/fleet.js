const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PermissionObject = require("./commonPermission");
const fleetSchema = new Schema({
  companyName: {
    type: String,
    default: null
  },
  phoneDetail: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  website: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  address1: {
    type: String,
    default: null
  },
  address2: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  },
  state: {
    type: String,
    default: null
  },
  zipCode: {
    type: String,
    default: null
  },
  permission: {
    type: PermissionObject,
    default: null
  },
  status: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model("Fleet", fleetSchema);
