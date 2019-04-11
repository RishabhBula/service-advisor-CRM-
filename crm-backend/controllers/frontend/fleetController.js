const fleetModal = require("../../models/fleet");
const mongoose = require("mongoose")
/* ------------Add New Fleet---------- */
const addNewFleet = async (req, res) => {
   const { body } = req;
   try {
      if (!body.fleetData.companyName) {
         return res.status(400).json({
            responsecode: 400,
            message: "Company name is required.",
            success: false
         })
      }
      const fleetData = {
         companyName: body.fleetData.companyName,
         phoneDetail: body.fleetData.phoneDetail,
         email: body.fleetData.email,
         notes: body.fleetData.notes,
         address1: body.fleetData.address1,
         address2: body.fleetData.address2,
         city: body.fleetData.city,
         state: body.fleetData.state,
         zipCode: body.fleetData.zipCode,
         fleetDefaultPermissions: body.fleetData.fleetDefaultPermissions,
         userId: body.userId,
         parentId: body.parentId,
         status: true
      }
      const addNewFleet = new fleetModal(fleetData)
      const result = await addNewFleet.save();
      if (!result) {
         return res.status(400).json({
            responsecode: 400,
            message: "Error uploading fleet data.",
            success: false
         })
      } else {
         return res.status(200).json({
            responsecode: 200,
            message: "Fleet data uploaded successfully!",
            success: true
         })
      }
   } catch (error) {
      console.log("This is Fleet adding error", error);
      res.status(500).json({
         responsecode: 500,
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}
/* ------------Add New Fleet End---------- */

/* ------------Get Fleet list---------- */
const getAllFleetList = async (req, res) => {
   const { query } = req;
   try {

      const fleetList = await fleetModal.find({
         $or: [
            { userId: mongoose.Types.ObjectId(query.userId) },
            { parentId: mongoose.Types.ObjectId(query.parentId) }
         ]
      })
      if (!fleetList) {
         return res.status(400).json({
            responsecode: 400,
            message: "Fleet data not foud.",
            success: false
         })
      } else {
         return res.status(200).json({
            responsecode: 200,
            data: fleetList,
            success: true
         })
      }
   } catch (error) {
      console.log("This is Fleet list error", error);
      res.status(500).json({
         responsecode: 500,
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}
/* ------------Get Fleet list---------- */

/* ------------Update Fleet Details---------- */
const updateFleetdetails = async (req, res) => {
   const { body } = req;
   try {
      if (!body.fleetId) {
         return res.status(400).json({
            responsecode: 400,
            message: "Fleet id is required.",
            success: false
         });
      } else {
         const updateFleetDetails = await fleetModal.findByIdAndUpdate(body.fleetId, {
            $set: body.fleetData
         })
         if (!updateFleetDetails) {
            return res.status(400).json({
               responsecode: 400,
               message: "Error updating fleet details.",
               success: false
            });
         } else {
            return res.status(200).json({
               responsecode: 200,
               message: "Fleet details updated successfully!",
               success: false
            });
         }
      }
   } catch (error) {
      console.log("This is update Fleet error", error);
      return res.status(500).json({
         responsecode: 500,
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}
/* ------------Update Fleet Details End---------- */
module.exports = {
   addNewFleet,
   getAllFleetList,
   updateFleetdetails
}