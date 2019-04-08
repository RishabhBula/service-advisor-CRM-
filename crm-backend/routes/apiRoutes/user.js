const express = require("express");
const router = express.Router();
const userController = require("../../controllers/frontend/userController");


router.get("/list", userController.listGet);


module.exports = router;