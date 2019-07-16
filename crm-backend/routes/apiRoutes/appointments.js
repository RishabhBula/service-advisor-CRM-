const express = require("express");
const router = express.Router();
const {
  appointmentList,
  addAppointment,
  getAppointmentDetails
} = require("./../../controllers/frontend/appointment");
const { authorisedUser } = require("./../../common/token");
/**
 *
 */
router.get("/", authorisedUser, appointmentList);
router.post("/", authorisedUser, addAppointment);
router.get("/:eventId", authorisedUser, getAppointmentDetails);
/**
 *
 */
module.exports = router;
