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
module.exports = {
  signupValidation,
  signupConfirmation,
  loginValidation
};
