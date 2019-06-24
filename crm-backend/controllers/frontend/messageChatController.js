const MessageChat = require("../../models/messagechat");
const OrderModal = require("../../models/order");
const mongoose = require("mongoose");
const commonValidation = require("../../common");
const { validationResult } = require("express-validator/check");

const sendMessageChat = async (req, res) => {
   const { body, currentUser } = req;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({
         message: commonValidation.formatValidationErr(errors.mapped(), true),
         success: false
      });
   }
   try {
      const messageData = {
         senderId: mongoose.Types.ObjectId(currentUser.id),
         receiverId: mongoose.Types.ObjectId(body.receiverId),
         orderId: mongoose.Types.ObjectId(body.orderId),
         messageData: body.messageData,
         userId: mongoose.Types.ObjectId(currentUser.id),
         parentId: currentUser.parentId ? mongoose.Types.ObjectId(currentUser.parentId) : mongoose.Types.ObjectId(currentUser.id),
         status: true,
         isDeleted: false
      }
      const messageElements = new MessageChat(messageData);
      await messageElements.save();
      const result2 = await OrderModal.find({
         _id: body.orderId
      })
      let payload = {
         messageId: [{
            messageId: messageElements._id
         }]
      }
      if (result2[0].messageId && result2[0].messageId.length) {
         for (let index = 0; index < result2[0].messageId.length; index++) {
            const element = result2[0].messageId[index];
            payload.messageId.push({
               messageId: element.messageId
            })
         }
      }
      await OrderModal.findByIdAndUpdate(body.orderId, {
         $set: payload
      })

      return res.status(200).json({
         data: messageData,
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
   sendMessageChat
}