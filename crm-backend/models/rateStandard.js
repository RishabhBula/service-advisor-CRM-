const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rateStandardSchema = new Schema({
  name: {
    type: String,
    default: null
  },
  hourlyRate: {
    type: Number,
    default: null
  },
  status: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("RateStandard", rateStandardSchema);
