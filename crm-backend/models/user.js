const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roleType: {
    type: Schema.Types.ObjectId,
    ref: "role",
    required: true
  },
  permission: {
    type: String,
    default: null
  },
  firstTimeUser: {
    type: Boolean,
    default: false
  },
  userSideActivation: {
    type: Boolean,
    default: false
  },
  userSideActivationValue: {
    type: String,
    default: null
  },
  status: {
    type: Boolean,
    default: true
  },
  loggedInIp: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("user", userSchema);
