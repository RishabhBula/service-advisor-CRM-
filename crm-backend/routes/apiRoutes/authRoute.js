const express = require("express");
const router = express.Router();
const authController = require("../../controllers/frontend/authController");
const validation = require("../../common/apiValidation");
  // eslint-disable-next-line
router.post("/signUp", validation.signupValidation, authController.signUp);
router.post("/confirmation",validation.signupConfirmation, authController.confirmationSignUp);

module.exports = router;
