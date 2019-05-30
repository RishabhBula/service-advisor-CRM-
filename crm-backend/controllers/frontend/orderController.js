const Orders = require("../../models/order");
const mongoose = require("mongoose");

/* get order number */
const countOrderNumber = async (req, res) => {
   try {
      const result = await Orders.countDocuments()
      return res.status(200).json({
         orderId: parseInt(result) + 1,
         success: true
      })
   } catch (error) {
      console.log("this is order count error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}

/* create new order */
const createNewOrder = async (req, res) => {
   const { body, currentUser } = req;
   try {
      const orderConst = {
         orderName: body.orderName,
         customerId: body.customerId ? mongoose.Types.ObjectId(body.customerId) : null,
         vehicleId: body.vehicleId ? mongoose.Types.ObjectId(body.vehicleId) : null,
         serviceId: body.serviceId ? mongoose.Types.ObjectId(body.serviceId) : null,
         inspectionId: body.inspectionId ? mongoose.Types.ObjectId(body.inspectionId) : null,
         timeClockId: body.timeClockId ? mongoose.Types.ObjectId(body.timeClockId) : null,
         messageId: body.messageId ? mongoose.Types.ObjectId(body.messageId) : null,
         userId: currentUser.id,
         parentId: currentUser.parrentId ? currentUser.parrentId : currentUser.id,
         workflowStatus: body.workflowStatus ? body.workflowStatus : null,
         isDeleted: false,
      }
      const orderData = new Orders(orderConst);
      const result = await orderData.save();

      return res.status(200).json({
         message: "Order created successfully",
         result,
         success: true
      })
   } catch (error) {
      console.log("this is create order error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}
module.exports = {
   countOrderNumber,
   createNewOrder
};