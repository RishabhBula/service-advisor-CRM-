const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/frontend/orderController");
const token = require("../../common/token");

/* ----------Get order count------------ */
router.get("/orderId", token.authorisedUser, orderController.countOrderNumber);

module.exports = router;
