const MessageChat = require("../../models/messagechat");
const UserModal = require("../../models/user");
const OrderModal = require("../../models/order");
const mongoose = require("mongoose");
const commonValidation = require("../../common");
const { validationResult } = require("express-validator/check");
const { Email, AvailiableTemplates } = require("../../common/Email");
const commonCrypto = require("../../common/crypto");
const moment = require("moment");
const { webURL } = require("../../config/app");

const sendMessageChat = async (req, res) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    const messageData = {
      senderId: mongoose.Types.ObjectId(body.senderId),
      receiverId: mongoose.Types.ObjectId(body.receiverId),
      orderId: mongoose.Types.ObjectId(body.orderId),
      messageAttachment: body.messageAttachment,
      messageData: body.messageData,
      isInternalNotes: body.isInternalNotes || false,
      userId: mongoose.Types.ObjectId(body.senderId),
      parentId: mongoose.Types.ObjectId(body.senderId),
      status: true,
      isDeleted: false
    };
    const messageElements = new MessageChat(messageData);
    await messageElements.save();

    if (!body.notToken && !body.isInternalNotes) {
      const encryptedOrderId = commonCrypto.encrypt(body.orderId);
      const encrypteCustomerId = commonCrypto.encrypt(body.customerId);
      const encrypteUserId = commonCrypto.encrypt(body.userId);
      const createdAt = moment(messageElements.createdAt).format("lll");
      const emailVar = new Email(body);
      const subject = `${body.subdomain}`;
      await emailVar.setSubject(
        "[Service Advisor]" + subject + " -  send you a message"
      );
      await emailVar.setTemplate(AvailiableTemplates.INSPECTION_TEMPLATE, {
        body: messageElements.messageData,
        companyName: body.companyName,
        createdAt: createdAt,
        orderTitle: body.orderTitle,
        subDomain: body.subdomain,
        encryptedOrderId: encryptedOrderId,
        encrypteCustomerId: encrypteCustomerId,
        encrypteUserId: encrypteUserId,
        url: webURL,
        titleMessage: "You have unread messages for",
        displayStyle: `style="text-align:center; display: block";`
      });
      await emailVar.sendEmail(body.email);
    }

    const result2 = await OrderModal.find({
      _id: body.orderId
    });
    let payload = {
      messageId: [
        {
          messageId: messageElements._id
        }
      ]
    };
    if (result2.length && result2[0].messageId) {
      for (let index = 0; index < result2[0].messageId.length; index++) {
        const element = result2[0].messageId[index];
        payload.messageId.push({
          messageId: element.messageId
        });
      }
    } else {
      return res.status(400).json({
        message: "Order data not found",
        success: false
      });
    }
    await OrderModal.findByIdAndUpdate(body.orderId, {
      $set: payload
    });

    return res.status(200).json({
      data: messageElements,
      message: "Message send successfully!",
      success: true
    });
  } catch (error) {
    console.log("this is add Message Chat error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
const verifyUserMessageLink = async (req, res) => {
  const { body } = req;
  try {
    let orderDetails, result,
      userData,
      messageData = [];
    if (body.order && body.customer) {
      const decryptedOrderId = commonCrypto.decrypt(body.order);
      const decryptedCustomerId = commonCrypto.decrypt(body.customer);
      const decryptedUserId = commonCrypto.decrypt(body.user);
      userData = await UserModal.findById(decryptedUserId);
      orderDetails = await OrderModal.findById(decryptedOrderId).populate(
        "customerId vehicleId serviceId.serviceId inspectionId.inspectionId messageId.messageId customerCommentId"
      );
      result = await OrderModal.populate(orderDetails,
        "customerId.fleet"
      );
      if (orderDetails.messageId) {
        for (let index = 0; index < orderDetails.messageId.length; index++) {
          const element = orderDetails.messageId[index];
          if (
            element.messageId &&
            element.messageId.receiverId.toString() ===
            decryptedCustomerId.toString()
          ) {
            element.messageId.isSender = false;
          }
          messageData.push(element.messageId);
        }
      }
    } else {
      orderDetails = await OrderModal.findById(body.orderId).populate(
        "customerId vehicleId serviceId.serviceId inspectionId.inspectionId messageId.messageId customerCommentId"
      );
      result = await OrderModal.populate(orderDetails,
        "customerId.fleet"
      );
      userData = await UserModal.findById(body.companyIDurl);
      if (orderDetails.messageId) {
        for (let index = 0; index < orderDetails.messageId.length; index++) {
          const element = orderDetails.messageId[index];
          if (
            element.messageId &&
            element.messageId.receiverId === body.customerId
          ) {
            element.messageId.isSender = false;
          }
          messageData.push(element.messageId);
        }
      }
    }
    if (result) {
      return res.status(200).json({
        data: result,
        messageData: messageData,
        companyData: userData,
        message: "Message Link Verified Successfully.",
        success: true
      });
    } else {
      return res.status(400).json({
        message: "Link expiered or unautherised user!",
        success: false
      });
    }
  } catch (error) {
    console.log("this is verify message error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
const updateInternalNotes = async (req, res) => {
  const { body } = req;
  try {
    await MessageChat.findOneAndUpdate(
      {
        _id: body.messageId,
        isInternalNotes: true
      },
      {
        $set: body
      }
    );

    return res.status(200).json({
      message: "Note added successfully",
      success: true
    });
  } catch (error) {
    console.log("this is verify message error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

module.exports = {
  sendMessageChat,
  verifyUserMessageLink,
  updateInternalNotes
};
