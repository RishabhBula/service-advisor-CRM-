const express = require("express");
const router = express.Router();
const userController = require("../../controllers/frontend/userController");

router.get("/list", userController.listGet);

/* ----------Get All user------------ */
router.get("/getAllUser", userController.getAllUserList);

module.exports = router;
