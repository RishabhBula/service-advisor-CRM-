const Service = require("../../models/services");
const mongoose = require("mongoose");

/* create new service */
const addNewService = async (req, res) => {
   const { body, currentUser } = req;
   try {
      console.log("!!!!!!!!!!!Body!!!!!!!!!!!", body);
      console.log("*******Part********", body.description.partId);

      const serviceData = {
         serviceName: body.serviceName,
         notes: body.notes,
         technician: body.technician,
         description: { partId: body.description.partId, tireId: body.description.tireId, laborId: body.description.laborId },
         price: { partId: body.price.partId, tireId: body.price.tireId },
         quantity: { partId: body.quantity.partId, tireId: body.quantity.tireId },
         hours: { laborId: body.hours.laborId },
         disc: { partId: body.disc.partId, tireId: body.disc.tireId, laborId: body.disc.laborId },
         subtotal: { partId: body.subtotal.partId, tireId: body.subtotal.tireId, laborId: body.subtotal.laborId },
         lableStatus: { partId: body.lableStatus.partId, tireId: body.lableStatus.tireId, laborId: body.lableStatus.laborId },
         epa: body.epa,
         discount: body.discount,
         taxes: body.taxes,
         serviceTotal: body.serviceTotal,
         userId: currentUser.id,
         parentId: currentUser.parentId ? currentUser.parentId : currentUser.id,
         status: true,
         isDeleted: false
      }
      const serviceContent = new Service(serviceData);
      const result = serviceContent.save();
      return res.status(200).json({
         message: "Service added successfully",
         success: true
      })

   } catch (error) {
      console.log("this is add service error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}
module.exports = {
   addNewService
};