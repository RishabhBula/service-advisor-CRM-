const express = require("express");
const router = express.Router();
const inspectionController = require("../../controllers/frontend/inspectionController");
const token = require("../../common/token");

/* ----------Add new inspection------------ */
router.post("/addInspection", token.authorisedUser, inspectionController.creteNewInspection);

module.exports = router;
