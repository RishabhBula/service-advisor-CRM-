const express = require("express");
const router = express.Router();
const labelController = require("../../controllers/frontend/labelController");
const token = require("../../common/token");

/* ----------Get All Label------------ */
router.get("/getLabel", token.authorisedUser, labelController.getAllLabelList);

/* add saved label */
router.post("/addNewLabel", token.authorisedUser, labelController.addSavedLabel)

module.exports = router;
