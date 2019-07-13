const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const transactionSchema = new Schema({
  transactionType: {
    type: String
  },
  transactionId: {
    type: String
  },
  amount: {
    type: Number
  },
  userId: {
    type: Mongoose.Types.ObjectId,
    ref: "user"
  },
  parentId: {
    type: Mongoose.Types.ObjectId,
    ref: "user"
  },
  transactionDetails: {
    type: Object
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = Mongoose.model("transaction", transactionSchema);
