const express = require("express");
const router = express.Router();
const labourController = require("../../controllers/frontend/labourController");
const token = require("../../common/token");
const validation = require("../../common/apiValidation");

/* ----------get all Standard routes------------ */
router.get("/getAllStdRate", token.authorisedUser, labourController.getAllStandardRate);

/* ----------add new standard rate routes------------ */
router.post("/addRate", token.authorisedUser,validation.addNewRateStandard, labourController.addNewrateStandard);
module.exports = router;
