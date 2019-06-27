const express = require("express");
const router = express.Router();
const timeClockController = require("../../controllers/frontend/timeClockController");
const token = require("../../common/token");
/**
 *
 */
router.post(
  "/addTimeLogs",
  token.authorisedUser,
  timeClockController.addTimeLogs
);
router.post(
  "/start-time-clock",
  token.authorisedUser,
  timeClockController.startTimer
);
router.get(
  "/get-time-log",
  token.authorisedUser,
  timeClockController.getTimeLogByTechnician
);
/**
 *
 */
module.exports = router;
