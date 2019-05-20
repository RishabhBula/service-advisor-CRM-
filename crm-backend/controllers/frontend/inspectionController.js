const Inspection = require("../../models/inspection");
const commonValidation = require("../../common");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator/check");

/* get order number */
const creteNewInspection = async (req, res) => {
   const { body, currentUser } = req
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({
         message: commonValidation.formatValidationErr(errors.mapped(), true),
         success: false
      });
   }
   try {
      let result
      for (let index = 0; index < body.length; index++) {
         const element = body[index];
         const inspectionDataModal = {
            inspectionName: element.inspectionName,
            item: element.item,
            template: element.template,
            userId: currentUser.id,
            parentId: currentUser.parentId ? currentUser.parentId : currentUser.id,
            status: true,
            isDeleted: false
         }
         const inspectionContent = new Inspection(inspectionDataModal);
         result = await inspectionContent.save()
      }
      if (result) {
         return res.status(200).json({
            message: `${body.length} Inspection added successfully!`,
            success: true
         })
      }
   } catch (error) {
      console.log("this is create inspection error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}
/* get Inpection Data */
const getInspectionData = async (req, res) => { }
module.exports = {
   creteNewInspection
};