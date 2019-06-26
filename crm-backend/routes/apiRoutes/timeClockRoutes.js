const express = require("express");
const router = express.Router();
const timeClockController = require("../../controllers/frontend/timeClockController");
const token = require("../../common/token");
const validation = require("../../common/apiValidation");

/* add Time logs */
router.post("/addTimeLogs", token.authorisedUser, timeClockController.addTimeLogs)

module.exports = router;
