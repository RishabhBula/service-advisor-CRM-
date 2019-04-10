const express = require("express");
const router = express.Router();
const customerController = require("../../controllers/frontend/customerController");
const token = require("../../common/token");

/* ----------Get All user------------ */
router.post("/createCustomer", token.authorisedUser, customerController.createCustomer);

module.exports = router;
