const express = require("express");
const router = express.Router();
const labourController = require("../../controllers/frontend/labourController");
const token = require("../../common/token");

/* ----------get all Standard routes------------ */
router.get("/getAllStdRate", token.authorisedUser, labourController.getAllStandardRate);

module.exports = router;
