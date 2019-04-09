const express = require("express");
const router = express.Router();
const userController = require("../../controllers/frontend/userController");
const token = require("../../common/token");

router.get("/list", userController.listGet);

/* ----------Get All user------------ */
router.get("/getAllUser", token.authorisedUser, userController.getAllUserList);
router.get("/getProfile", token.authorisedUser, userController.getProfile);

module.exports = router;
