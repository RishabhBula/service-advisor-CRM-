const MessageChat = require("../../models/messagechat");
const UserModal = require("../../models/user");
const CustomerModal = require("../../models/customer");
const OrderModal = require("../../models/order");
const mongoose = require("mongoose");
const commonValidation = require("../../common");
const { validationResult } = require("express-validator/check");
const { Email, AvailiableTemplates } = require("../../common/Email");
const commonCrypto = require("../../common/crypto");

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
         senderId: currentUser.id ? mongoose.Types.ObjectId(currentUser.id) : body.senderId,
         receiverId: mongoose.Types.ObjectId(body.receiverId),
         orderId: mongoose.Types.ObjectId(body.orderId),
         messageAttachment: body.messageAttachment,
         messageData: body.messageData,
         userId: currentUser.id ? mongoose.Types.ObjectId(currentUser.id) : body.senderId,
         parentId: currentUser.id ? mongoose.Types.ObjectId(currentUser.id) : body.senderId,
         status: true,
         isDeleted: false
      }
      const messageElements = new MessageChat(messageData);
      await messageElements.save();

      if (!body.notToken) {
         const encryptedOrderId = commonCrypto.encrypt(body.orderId);
         const encrypteCustomerId = commonCrypto.encrypt(body.customerId);
         const encrypteUserId = commonCrypto.encrypt(body.userId)
         const emailVar = new Email(body);
         const subject = `${currentUser.subdomain}`
         const emailMsgBody = `<div><b>${messageElements.messageData}</b></div><div><p><a href="http://d-company.localhost:3000/order-summary?order=${encryptedOrderId}&customer=${encrypteCustomerId}&user=${encrypteUserId}"
         style="display:inline-block;background:green;color:#fff;padding:6px 30px;font-size:16px;text-decoration:none;border-radius:4px;margin:15px 0px"
         target="_blank">Check Now</a>
         </p></div>`
         await emailVar.setSubject("[Service Advisor]" + subject + " -  send you a message");
         await emailVar.setTemplate(AvailiableTemplates.INSPECTION_TEMPLATE, {
            body: emailMsgBody,
         });
         await emailVar.sendEmail(body.email);
      }

      const result2 = await OrderModal.find({
         _id: body.orderId
      })
      let payload = {
         messageId: [{
            messageId: messageElements._id
         }]
      }
      if (result2.length && result2[0].messageId) {
         for (let index = 0; index < result2[0].messageId.length; index++) {
            const element = result2[0].messageId[index];
            payload.messageId.push({
               messageId: element.messageId
            })
         }
      } else {
         return res.status(400).json({
            message: "Order data not found",
            success: false
         })
      }
      await OrderModal.findByIdAndUpdate(body.orderId, {
         $set: payload
      })

      return res.status(200).json({
         data: messageElements,
         message: "Message send successfully!",
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
const verifyUserMessageLink = async (req, res) => {
   const { body } = req;
   try {
      let orderDetails, userData, messageData = []
      if (body.order && body.customer) {
         const decryptedOrderId = commonCrypto.decrypt(body.order);
         const decryptedCustomerId = commonCrypto.decrypt(body.customer);
         const decryptedUserId = commonCrypto.decrypt(body.user);
         userData = await UserModal.findById(decryptedUserId);
         orderDetails = await OrderModal.findById(decryptedOrderId).populate("customerId vehicleId serviceId.serviceId inspectionId.inspectionId messageId.messageId customerCommentId")
         if (orderDetails.messageId) {
            for (let index = 0; index < orderDetails.messageId.length; index++) {
               const element = orderDetails.messageId[index];
               if (element.messageId && element.messageId.receiverId == decryptedCustomerId) {
                  element.messageId.isSender = false
               }
               messageData.push(element.messageId)
            }
         }
      } else {
         orderDetails = await OrderModal.findById(body.orderId).populate("customerId vehicleId serviceId.serviceId inspectionId.inspectionId messageId.messageId customerCommentId")
         userData = await UserModal.findById(body.companyIDurl);
         if (orderDetails.messageId) {
            for (let index = 0; index < orderDetails.messageId.length; index++) {
               const element = orderDetails.messageId[index];
               if (element.messageId && element.messageId.receiverId == body.customerId) {
                  element.messageId.isSender = false
               }
               messageData.push(element.messageId)
            }
         }
      }
      if (orderDetails) {
         return res.status(200).json({
            data: orderDetails,
            messageData: messageData,
            companyData: userData,
            message: "Message Link Verified Successfully.",
            success: true
         })
      } else {
         return res.status(400).json({
            message: "Link expiered or unautherised user!",
            success: false
         })
      }
   } catch (error) {
      console.log("this is verify message error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}

module.exports = {
   sendMessageChat,
   verifyUserMessageLink
}