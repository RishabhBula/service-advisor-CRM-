const express = require("express");
const router = express.Router();
const labourController = require("../../controllers/frontend/labourController");
const token = require("../../common/token");

/* ----------get all Standard routes------------ */
router.get("/getAllStdRate", token.authorisedUser, labourController.getAllStandardRate);

/* ----------add new standard rate routes------------ */
router.post("/addRate", token.authorisedUser, labourController.addNewrateStandard);

/* ----------Get single rate standard rate------------ */
router.post("/getSingleRate", token.authorisedUser, labourController.getSingleStandardRate);

module.exports = router;
