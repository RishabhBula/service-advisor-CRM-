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
router.post("/forgot-password",validation.forgotPasswordValidation,authController.userForgotPassword);
router.post("/verify-link",validation.verifyLinkValidation,authController.userVerifyLink)
router.post("/reset-password",validation.resetPasswordValidation,authController.userResetpassword)

module.exports = router;
