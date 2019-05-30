const MessageTemplate = require("../../models/messageTemplate");
const mongoose = require("mongoose");

/* Add new message Template */
const addMessageTemplate = async (req, res) => {
   const { body, currentUser } = req;
   try {
      const msgTempData = {
         templateName: body.templateName,
         subject: body.subject,
         messageText: body.messageText,
         orderId: body.orderId,
         userId: currentUser.id,
         parentId: currentUser.parentId ? currentUser.parentId : currentUser.id,
         isDeleted: false,
      }
      const existingMsgTemp = await MessageTemplate.find({
         templateName: body.templateName
      })
      if (existingMsgTemp.length) {
         return res.status(400).json({
            message: "Template name already exist, enter new name!",
            success: false
         })
      } else {
         const msgTempElements = new MessageTemplate(msgTempData);
         const msgTempResult = await msgTempElements.save();
         return res.status(200).json({
            message: "Message Template saved successfully!",
            data: msgTempResult,
            success: true
         })
      }
   } catch (error) {
      console.log("this is add Message Template error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}
/* get all Message template */
const getAllMsgTemplateList = async (req, res) => {
   const { currentUser, query } = req;
   try {
      const id = currentUser.id;
      const messageId = query.id;
      const parentId = currentUser.parentId || currentUser.id;
      let condition = {};
      condition["$and"] = [
         {
            $or: [
               {
                  parentId: mongoose.Types.ObjectId(id)
               },
               {
                  parentId: mongoose.Types.ObjectId(parentId)
               },
               {
                  _id: mongoose.Types.ObjectId(messageId),
               }
            ]
         },
         {
            $or: [
               {
                  isDeleted: {
                     $exists: false
                  }
               },
               {
                  isDeleted: false
               }
            ]
         }
      ];
      if (messageId) {
         condition["$and"].push({
            _id: mongoose.Types.ObjectId(messageId),
         });
      }
      const result1 = await MessageTemplate.find(condition)
      const result = result1
      return res.status(200).json({
         data: result,
         success: true
      })
   } catch (error) {
      console.log("this is get Message Template error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}

/*  get all message template list for Seach */
const getAllMsgTemplateListSearch = async (req, res) => {
   const { query, currentUser } = req;
   try {
      const orderId = query.orderId
      const id = currentUser.id;
      const parentId = currentUser.parentId || currentUser.id;
      const searchValue = query.search;
      let condition = {};
      condition["$and"] = [
         {
            $or: [
               {
                  parentId: mongoose.Types.ObjectId(id)
               },
               {
                  parentId: mongoose.Types.ObjectId(parentId)
               }
            ]
         },
         {
            $or: [
               {
                  isDeleted: {
                     $exists: false
                  }
               },
               {
                  isDeleted: false
               }
            ]
         }
      ];
      if (searchValue) {
         condition["$and"].push({
            $or: [
               {
                  templateName: {
                     $regex: new RegExp(searchValue.trim(), "i"),
                  },
               }
            ],
         });
      }
      const result1 = await MessageTemplate.find({
         ...condition,
         orderId: mongoose.Types.ObjectId(orderId),
         userId: currentUser.id
      }).populate('orderId')
      const getAllMsgTemp = await MessageTemplate.populate(result1, { path: "orderId.customerId orderId.vehicleId" })
      const result = getAllMsgTemp
      return res.status(200).json({
         data: result,
         success: true
      })
   } catch (error) {
      console.log("this is get label error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}

/* update message template details */
const updateMessageTemplate = async (req, res) => {
   const { body } = req;
   try {
      const result = await MessageTemplate.findByIdAndUpdate(body._id, {
         $set: body
      })
      return res.status(200).json({
         message: "Message Template updated successfully",
         result,
         success: true
      })
   } catch (error) {
      console.log("this is get label error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}
module.exports = {
   addMessageTemplate,
   getAllMsgTemplateList,
   getAllMsgTemplateListSearch,
   updateMessageTemplate
}