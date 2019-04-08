const { body } = require("express-validator/check");
const { validationMessage, otherMessage } = require("./validationMessage");

const signupValidation = [
  body("firstName")
    .not()
    .isEmpty()
    .withMessage(validationMessage.firstName)
    .trim(),
  body("lastName")
    .not()
    .isEmpty()
    .withMessage(validationMessage.lastName),
  body("email", validationMessage.emailValidation)
    .trim()
    .isEmail()
    .withMessage(validationMessage.emailInvalid),
  body("password")
    .not()
    .isEmpty()
    .withMessage(validationMessage.passwordValidation)
    .trim()
    .isLength({ min: 6 })
    .withMessage(validationMessage.minimumPasswordValidation)
];

const signupConfirmation = [
  body("userId")
    .not()
    .isEmpty()
    .withMessage("Please enter User Id.")
    .trim(),
  body("activeValue")
    .not()
    .isEmpty()
    .withMessage("Please enter active value.")
];
const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Email must be a valid.")
    .trim(),
  body("password", "Password must be at least 6 character long.")
    .trim()
    .isLength({ min: 6 })
];
const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("Email must be a valid.")
    .trim()
];
const verifyLinkValidation = [
  body("user")
    .not()
    .isEmpty()
    .withMessage("User field is required.")
    .trim(),
  body("verification")
    .not()
    .isEmpty()
    .withMessage("verification field is required.")
    .trim(),
  body("token")
    .not()
    .isEmpty()
    .withMessage("token field is required.")
    .trim()
];
const resetPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("Email must be a valid.")
    .trim(),
  body("password")
    .not()
    .isEmpty()
    .withMessage("password field is required.")
    .trim()
];

const createUserValidation = [
  body("firstName")
    .not()
    .isEmpty()
    .withMessage(validationMessage.firstName)
    .trim(),
  body("lastName")
    .not()
    .isEmpty()
    .withMessage(validationMessage.lastName),
  body("email", validationMessage.emailValidation)
    .trim()
    .isEmail()
    .withMessage(validationMessage.emailInvalid),
  body("roleType")
    .not()
    .isEmpty()
    .withMessage("Role type is required.")
    .trim()
];

const userVerify = [
  body("userId")
    .not()
    .isEmpty()
    .withMessage("UserId is required. ")
    .trim(),
  body("activeValue")
    .not()
    .isEmpty()
    .withMessage("Active value is required. "),
  body("password")
    .not()
    .isEmpty()
    .withMessage(validationMessage.passwordValidation)
    .trim()
    .isLength({ min: 6 })
    .withMessage(validationMessage.minimumPasswordValidation)
];


const userVerifyLink = [
  body("userId")
    .not()
    .isEmpty()
    .withMessage("UserId is required. ")
    .trim(),
  body("activeValue")
    .not()
    .isEmpty()
    .withMessage("Active value is required. ")
];



module.exports = {
  signupValidation,
  signupConfirmation,
  loginValidation,
  forgotPasswordValidation,
  verifyLinkValidation,
  resetPasswordValidation,
  createUserValidation,
  userVerify,
  userVerifyLink
};
