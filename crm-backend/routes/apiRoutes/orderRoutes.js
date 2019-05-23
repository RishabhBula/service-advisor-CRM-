const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/frontend/orderController");
const token = require("../../common/token");

// Get order count
router.get("/orderId", token.authorisedUser, orderController.countOrderNumber);

// create new order
router.post("/addOrder", token.authorisedUser, orderController.createNewOrder);

// get orders
router.get("/getOrders", token.authorisedUser, orderController.listOrders);

/**
 *
 */
module.exports = router;
