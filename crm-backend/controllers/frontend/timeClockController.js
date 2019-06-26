const TimeClock = require("../../models/timeClock");
const OrderModal = require("../../models/order");
const mongoose = require("mongoose");
const commonValidation = require("../../common");
const { validationResult } = require("express-validator/check");

const addTimeLogs = async (req, res) => {
   const { body, currentUser } = req;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({
         message: commonValidation.formatValidationErr(errors.mapped(), true),
         success: false
      });
   }
   try {
      const Duration = (body.endDateTime - body.startDateTime)
      const timeLogsData = {
         type: body.type,
         technicianId: mongoose.Types.ObjectId(body.technicianId),
         vehicleId: mongoose.Types.ObjectId(body.vehicleId),
         startDateTime: body.startDateTime,
         endDateTime: body.endDateTime,
         activity: mongoose.Types.ObjectId(body.activity),
         duration: Duration,
         orderId: mongoose.Types.ObjectId(body.orderId),
         userId: mongoose.Types.ObjectId(currentUser.id),
         parentId: currentUser.parentId ? mongoose.Types.ObjectId(currentUser.parentId) : mongoose.Types.ObjectId(currentUser.id),
         isDeleted: false
      }
      const timeLogElements = new TimeClock(timeLogsData);
      await timeLogElements.save();
      const result2 = await OrderModal.find({
         _id: body.orderId
      })
      const payload = {
         timeClockId: [
            {
               timeClockId: timeLogElements._id
            }
         ]
      }
      if (result2[0].timeClockId && result2[0].timeClockId.length) {
         for (let index = 0; index < result2[0].timeClockId.length; index++) {
            const element = result2[0].timeClockId[index];
            payload.timeClockId.push({
               timeClockId: element.timeClockId
            })
         }
      }
      await OrderModal.findByIdAndUpdate(body.orderId, {
         $set: payload
      })
      return res.status(200).json({
         data: messageElements,
         success: true
      })
   } catch (error) {
      console.log("this is add Message Chat error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}

module.exports = {
   addTimeLogs
}