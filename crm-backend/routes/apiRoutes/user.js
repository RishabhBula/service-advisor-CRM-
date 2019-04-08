const express = require("express");
const router = express.Router();
const userController = require("../../controllers/frontend/userController");
const token = require("../../common/token");

/* ----------Get All user------------ */
router.get("/", token.authorisedUser, userController.getAllUserList);

module.exports = router;
