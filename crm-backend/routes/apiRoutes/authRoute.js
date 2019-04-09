const express = require("express");
const router = express.Router();
const authController = require("../../controllers/frontend/authController");
const validation = require("../../common/apiValidation");
const token = require("../../common/token");
// eslint-disable-next-line
router.post("/signUp", validation.signupValidation, authController.signUp);
router.post(
  "/confirmation",
  validation.signupConfirmation,
  authController.confirmationSignUp
);
router.post("/login", validation.loginValidation, authController.loginApp);
router.post(
  "/forgot-password",
  validation.forgotPasswordValidation,
  authController.userForgotPassword
);
router.post(
  "/verify-link",
  validation.verifyLinkValidation,
  authController.userVerifyLink
);
router.post(
  "/reset-password",
  validation.resetPasswordValidation,
  authController.userResetpassword
);
router.post("/company-setup", authController.userCompanySetup);
router.post(
  "/createUser",
  token.authorisedUser,
  validation.createUserValidation,
  authController.createUser
);
router.post("/verfiyUser", validation.userVerify, authController.verfiyUser);
router.post(
  "/verfiyUserLink",
  validation.userVerifyLink,
  authController.verfiyUserLink
);
router.post("/image-upload", token.authorisedUser, authController.imageUpload);
router.post("/image-delete", token.authorisedUser, authController.imageDelete);
module.exports = router;
