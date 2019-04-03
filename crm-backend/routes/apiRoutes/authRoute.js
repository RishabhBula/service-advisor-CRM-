const express = require("express");
const router = express.Router();
const authController = require("../../controllers/frontend/authController");
const validation = require("../../common/apiValidation");

router.post("/signUp", validation.signupValidation, authController.signUp);

module.exports = router;
