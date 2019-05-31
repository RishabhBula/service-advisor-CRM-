const Service = require("../../models/services");
const mongoose = require("mongoose");
const CustomerAndUser = require("../../models/customerAndUser")
const Label = require("../../models/label")
/* create new service */
const addNewService = async (req, res) => {
   const { body, currentUser } = req;
   try {
      const cutomerUser = {
         customerComment: body.customerComment,
         userRecommendations: body.userRecommendations,
         userId: currentUser.id,
         parentId: currentUser.parentId ? currentUser.parentId : currentUser.id,
         status: true,
         isDeleted: false
      }
      let serviceData, isCannedService
      for (let index = 0; index < body.services.length; index++) {

         const element = body.services[index];
         if (!element.name) {
            return res.status(400).json({
               message: "Service Name is required",
               success: false
            })
         }
         if (element.isCannedService) {
            isCannedService = true
            const CannedServiceData = await Service.find({
               serviceName:element.name,
               isCannedService: true
            })
            if (CannedServiceData.length) {
               return res.status(400).json({
                  message:"Canned service name already exist,enter new name.",
                  success: false
               })
            }
         }
         serviceData = {
            serviceName: element.name,
            notes: element.notes,
            serviceItems: element.serviceItems,
            epa: element.epa,
            discount: element.discount,
            technician: element.technician.value,
            taxes: element.taxes,
            isCannedService: element.isCannedService ? element.isCannedService : false,
            serviceTotal: element.serviceTotal,
            userId: currentUser.id,
            parentId: currentUser.parentId ? currentUser.parentId : currentUser.id,
            status: true,
            isDeleted: false
         }

         const serviceContent = new Service(serviceData);
         const result = await serviceContent.save();
      }
      const customerAndUserContent = new CustomerAndUser(cutomerUser);
      const result = await customerAndUserContent.save();
      console.log(isCannedService);
      
      return res.status(200).json({
         message: `${body.services.length} ${isCannedService ? 'canned' : null} Service added successfully`,
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
/* get all canned services */
const getAllCannedServices = async (req, res) => {
   const { currentUser, query } = req;
   try {
      const id = currentUser.id;
      const searchValue = query.search;
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
               }
            ]
         },
         {
            $or: [
               {
                  isDeleted: false,
                  isCannedService: true
               }
            ]
         }
      ];
      if (searchValue) {
         condition["$and"].push({
            $or: [
               {
                  serviceName: {
                     $regex: new RegExp(searchValue.trim(), "i"),
                  },
               }
            ],
         });
      }
      const getAllCannedServices = await Service.find(condition)
      return res.status(200).json({
         data: getAllCannedServices,
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
   addNewService,
   getAllCannedServices
};