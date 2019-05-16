const Orders = require("../../models/order");
const mongoose = require("mongoose");

/* get order number */
const countOrderNumber = async (req, res) => {
   const { currentUser } = req;
   try {
      const result = await Orders.find({ userId: currentUser.id }).count()
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
module.exports = {
   countOrderNumber
};