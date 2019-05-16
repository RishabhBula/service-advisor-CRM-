const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
   serviceName: {
      type: String,
      default: null,
   },
   notes: {
      type: String,
      default: null,
   },
   technician: {
      type: [Schema.Types.ObjectId],
      ref: "user",
      default: null,
   },
   description: {
      type: [
         new Schema({
            partId: Object,
            tireId: Object,
            laborId: Object,
         })
      ],
      default: null
   },
   price: {
      type: [
         new Schema({
            partId: Object,
            tireId: Object
         })
      ],
      default: null
   },
   quantity: {
      type: [
         new Schema({
            partId: Object,
            tireId: Object
         })
      ],
      default: null
   },
   hours: {
      type: [
         new Schema({
            laborId: Object
         })
      ],
      default: null
   },
   disc: {
      type: [
         new Schema({
            laborId: Object,
            partId: Object,
            tireId: Object
         })
      ],
      default: null
   },
   subtotal: {
      type: [
         new Schema({
            laborId: Object,
            partId: Object,
            tireId: Object
         })
      ],
      default: null
   },
   lableStatus: {
      type: [
         new Schema({
            laborId: Object,
            partId: Object,
            tireId: Object
         })
      ],
      default: null
   },
   epa: {
      type: Object,
      default: null
   },
   discount: {
      type: Object,
      default: null
   },
   taxes: {
      type: Object,
      default: null
   },
   serviceTotal: {
      type: Number,
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

module.exports = mongoose.model("Service", serviceSchema);
