const Service = require("../../models/services");
const mongoose = require("mongoose");

/* create new service */
const addNewService = async (req, res) => {
   const { body, currentUser } = req;
   try {
      for (let index = 0; index < body.length; index++) {
         const element = body[index];
         const serviceData = {
            serviceName: element.serviceName,
            notes: element.notes,
            technician: element.technician,
            description: element.description,
            price: element.price,
            quantity: element.quantity,
            hours: element.hours,
            disc: element.disc,
            subtotal: element.subtotal,
            lableStatus: element.lableStatus,
            epa: element.epa,
            discount: element.discount,
            taxes: element.taxes,
            serviceTotal: element.serviceTotal,
            userId: currentUser.id,
            parentId: currentUser.parentId ? currentUser.parentId : currentUser.id,
            status: true,
            isDeleted: false
         }
         const serviceContent = new Service(serviceData);
         const result = await serviceContent.save();
      }
      return res.status(200).json({
         message: `${body.length}Service added successfully`,
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