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
      let serviceData, serviceResultData = []
      for (let index = 0; index < body.services.length; index++) {

         const element = body.services[index];
         if (!element.serviceName) {
            return res.status(400).json({
               message: "Service Name is required",
               success: false
            })
         }
         serviceData = {
            serviceName: element.serviceName,
            note: element.note,
            serviceItems: element.serviceItems,
            epa: element.epa,
            discount: element.discount,
            technician: element.technician ? element.technician._id : null,
            taxes: element.taxes,
            isCannedService: false,
            isConfirmedValue: element.isConfirmedValue,
            serviceTotal: element.serviceTotal,
            userId: currentUser.id,
            parentId: currentUser.parentId ? currentUser.parentId : currentUser.id,
            status: true,
            isDeleted: false
         }
         // const addedService = await Service.updateOne({
         //    _id: element._id,
         //    isCannedService: false
         // }, {
         //       $set: serviceData
         //    })
         const serviceContent = new Service(serviceData);
         const result = await serviceContent.save();
         serviceResultData.push(result)
      }
      const customerAndUserContent = new CustomerAndUser(cutomerUser);
      const commentResult = await customerAndUserContent.save();
      return res.status(200).json({
         serviceResultData,
         commentResult,
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
/* add new canned service */
const addNewCannedService = async (req, res) => {
   const { body, currentUser } = req;
   try {
      let serviceData, serviceResultData = []
      for (let index = 0; index < body.services.length; index++) {
         const element = body.services[index];
         if (!element.serviceName) {
            return res.status(400).json({
               message: "Service Name is required",
               success: false
            })
         }
         const CannedServiceData = await Service.find({
            serviceName: element.serviceName,
            isCannedService: true,
            userId: currentUser.id,
            parentId: currentUser.parentId ? currentUser.parentId : currentUser.id
         })
         if (CannedServiceData.length) {
            return res.status(400).json({
               message: "Canned service name already exist,enter new name.",
               success: false
            })
         }
         serviceData = {
            serviceName: element.serviceName,
            note: element.note,
            serviceItems: element.serviceItems,
            epa: element.epa,
            discount: element.discount,
            technician: element.technician ? element.technician._id : null,
            taxes: element.taxes,
            isCannedService: true,
            isConfirmedValue: element.isConfirmedValue,
            serviceTotal: element.serviceTotal,
            userId: currentUser.id,
            parentId: currentUser.parentId ? currentUser.parentId : currentUser.id,
            status: true,
            isDeleted: false
         }
         const addedService = await Service.findByIdAndUpdate(element._id, {
            $set: serviceData
         })
         if (!addedService) {
            const serviceContent = new Service(serviceData);
            const result = await serviceContent.save();
            serviceResultData.push(result)
         } else {
            const seviceData = await Service.findById(element._id)
            serviceResultData.push(seviceData)
         }
      }
      return res.status(200).json({
         message: "Canned Service added successfully",
         success: true
      })
   } catch (error) {
      console.log("this is add canned service error", error);
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
   getAllCannedServices,
   addNewCannedService
};