const fleetModal = require("../../models/fleet");
const mongoose = require("mongoose");
/* ------------Add New Fleet---------- */
const addNewFleet = async (req, res) => {
   const { body } = req;
   try {
      if (!body.fleetData.companyName) {
         return res.status(400).json({
            responsecode: 400,
            message: "Company name is required.",
            success: false,
         });
      }
      if (body.parentId === null) {
         body.parentId = body.userId
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
         status: true,
      };
      const addNewFleet = new fleetModal(fleetData);
      const result = await addNewFleet.save();
      if (!result) {
         return res.status(400).json({
            responsecode: 400,
            message: "Error uploading fleet data.",
            success: false,
         });
      } else {
         return res.status(200).json({
            responsecode: 200,
            message: "Fleet data uploaded successfully!",
            success: true,
         });
      }
   } catch (error) {
      console.log("This is Fleet adding error", error);
      res.status(500).json({
         responsecode: 500,
         message: error.message ? error.message : "Unexpected error occure.",
         success: false,
      });
   }
};
/* ------------Add New Fleet End---------- */

/* ------------Get Fleet list---------- */
const getAllFleetList = async (req, res) => {
   const { query } = req;
   try {
      const limit = parseInt(query.limit || 10);
      const page = parseInt(query.page);
      const offset = (page - 1) * limit;
      const searchValue = query.search;
      const sort = query.sort;
      const status = query.status;
      let condition = {}
      let sortBy = {};
      switch (sort) {
         case "loginasc":
            sortBy = {
               updatedAt: -1,
            };
            break;
         case "nasc":
            sortBy = {
               companyName: 1
            };
            break;
         case "ndesc":
            sortBy = {
               companyName: -1
            };
            break;
         default:
            sortBy = {
               createdAt: -1,
            };
            break;
      }
      if (status) {
         condition = { status: status };
      }
      if (searchValue) {
         condition = {
            $or: [
               {
                  companyName: new RegExp(searchValue, "i")
               },
               {
                  email: new RegExp(searchValue, "i")
               }

            ]
         }
      }
         const fleetList = await fleetModal.find({
            $or: [
               { userId: mongoose.Types.ObjectId(query.userId) },
               { parentId: mongoose.Types.ObjectId(query.parentId) },
            ],
            ...condition
         }).sort(sortBy)
            .skip(offset)
            .limit(limit);
         const getAllFleetCount = await fleetModal.countDocuments({
            $or: [
               { userId: mongoose.Types.ObjectId(query.userId) },
               { parentId: mongoose.Types.ObjectId(query.parentId) },
            ],
            ...condition,
         });
         if (!fleetList) {
            return res.status(400).json({
               responsecode: 400,
               message: "Fleet data not foud.",
               success: false,
            });
         } else {
            return res.status(200).json({
               responsecode: 200,
               data: fleetList,
               totalUsers: getAllFleetCount,
               success: true,
            });
         }
      } catch (error) {
         console.log("This is Fleet list error", error);
         res.status(500).json({
            responsecode: 500,
            message: error.message ? error.message : "Unexpected error occure.",
            success: false,
         });
      }
   };
   /* ------------Get Fleet list---------- */

   /* ------------Update Fleet Details---------- */
   const updateFleetdetails = async (req, res) => {
      const { body } = req;
      try {
         if (!body.fleetId) {
            return res.status(400).json({
               responsecode: 400,
               message: "Fleet id is required.",
               success: false,
            });
         } else {
            const updateFleetDetails = await fleetModal.findByIdAndUpdate(
               body.fleetId,
               {
                  $set: body.fleetData,
               }
            );
            if (!updateFleetDetails) {
               return res.status(400).json({
                  responsecode: 400,
                  message: "Error updating fleet details.",
                  success: false,
               });
            } else {
               return res.status(200).json({
                  responsecode: 200,
                  message: "Fleet details updated successfully!",
                  success: false,
               });
            }
         }
      } catch (error) {
         console.log("This is update Fleet error", error);
         return res.status(500).json({
            responsecode: 500,
            message: error.message ? error.message : "Unexpected error occure.",
            success: false,
         });
      }
   };
   /* ------------Update Fleet Details End---------- */
   module.exports = {
      addNewFleet,
      getAllFleetList,
      updateFleetdetails,
   };
