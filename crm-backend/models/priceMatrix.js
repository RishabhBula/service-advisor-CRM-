const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pricematrixSchema = new Schema({
   name: {
      type: String,
      default: null
   },
   userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
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

module.exports = mongoose.model("priceMatrix", pricematrixSchema);