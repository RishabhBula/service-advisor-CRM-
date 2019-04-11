const express = require("express");
const router = express.Router();
const fleetController = require("../../controllers/frontend/fleetController");
const token = require("../../common/token");

/* ----------Add New Fleet------------ */
router.post("/addFleet", token.authorisedUser, fleetController.addNewFleet);
router.get("/fleetList", token.authorisedUser, fleetController.getAllFleetList);
router.put('/updateFleet', token.authorisedUser,fleetController.updateFleetdetails);
module.exports = router;
