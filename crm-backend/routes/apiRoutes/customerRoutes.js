const express = require("express");
const router = express.Router();
const customerController = require("../../controllers/frontend/customerController");
const token = require("../../common/token");
const validation = require("../../common/apiValidation");
/* ----------Get All user------------ */
router.post("/createCustomer", validation.createCustomerValidation, token.authorisedUser, customerController.createCustomer);
router.get("/getAllCustomerList", token.authorisedUser, customerController.getAllCustomerList);
router.delete("/deleteCustomer/:userId", token.authorisedUser, customerController.deleteCustomer);
router.put("/updateCustomerdetails", token.authorisedUser, customerController.updateCustomerdetails);

module.exports = router;
