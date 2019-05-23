const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderName: {
    type: String,
    default: null
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    default: null
  },
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: "vehicle",
    default: null
  },
  serviceId: {
    type: [
      new Schema({
        serviceId: {
          type: Schema.Types.ObjectId,
          ref: "Service"
        }
      })
    ],
    default: []
  },
  inspectionId: {
    type: [Schema.Types.ObjectId],
    ref: "Inspection",
    default: []
  },
  timeClockId: {
    type: Schema.Types.ObjectId,
    ref: "TimeClock",
    default: null
  },
  messageId: {
    type: Schema.Types.ObjectId,
    ref: "Message",
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
  workflowStatus: {
    type: Schema.Types.ObjectId,
    ref: "orderStatus",
    default: null
  },
  status: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("Order", orderSchema);
