const fleetModal = require("../../models/fleet");

/* ------------Add New Fleet---------- */
const addNewFleet = async (req, res) => {
   const { body } = req;
   try {
      if (!body.companyName) {
         return res.status(400).json({
            responsecode: 400,
            message: "Company name is required.",
            success: false
         })
      }
      const fleetData = {
         companyName: body.companyName,
         phoneDetail: body.phoneDetail,
         email: body.email,
         notes: body.notes,
         address1: body.address1,
         address2: body.address2,
         city: body.city,
         state: body.state,
         zipCode: body.zipCode,
         permission: body.permission,
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
module.exports = {
   addNewFleet
}