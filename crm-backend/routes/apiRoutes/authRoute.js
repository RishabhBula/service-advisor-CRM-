const express = require("express");
const router = express.Router();
const authController = require("../../controllers/frontend/authController");
const validation = require("../../common/apiValidation");
  // eslint-disable-next-line
router.post("/signUp", validation.signupValidation, authController.signUp);
router.post(
  "/confirmation",
  validation.signupConfirmation,
  authController.confirmationSignUp
);
router.post("/login",validation.loginValidation, authController.loginApp);
router.post("/forgot-password",authController.userForgotPassword);
router.post("/verify-link",authController.userVerifyLink)
router.post("/reset-password",authController.userResetpassword)

module.exports = router;
