const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inspectionSchema = new Schema({
   inspectionName: {
      type: String,
      default: null
   },
   item: {
      type: [
         new Schema({
            name: {
               type: String,
               default: null
            },
            note: String,
            color: {
               type: Object,
               default: null
            },
            aprovedStatus: {
               type: Boolean,
               default: false
            }
         })
      ],
      default: [],
   },
   isTemplate: {
      type: Boolean,
      default: false
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

module.exports = mongoose.model("Inspection", inspectionSchema);
