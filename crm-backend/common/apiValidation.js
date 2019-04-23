const { body } = require("express-validator/check");
const { validationMessage } = require("./validationMessage");
const userModel = require("../models/user");

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
    .withMessage(validationMessage.minimumPasswordValidation),
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
    .withMessage("Please enter active value."),
];
const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Email must be a valid.")
    .trim(),
  body("password", "Password must be at least 6 character long.")
    .trim()
    .isLength({ min: 6 }),
];
const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("Email must be a valid.")
    .trim(),
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
    .trim(),
];
const resetPasswordValidation = [
  body("password")
    .not()
    .isEmpty()
    .withMessage("password field is required.")
    .trim(),
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
    .withMessage(validationMessage.emailInvalid)
    .custom(async value => {
      const userFind = await userModel.find({ email: value, isDeleted: false });
      if (userFind.length) {
        throw new Error(validationMessage.emailAlreadyExist);
      }
      return true;
    }),
  body("roleType")
    .not()
    .isEmpty()
    .withMessage("Role type is required.")
    .trim(),
];
const updateUserValidation = [
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
    .trim(),
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
    .withMessage(validationMessage.minimumPasswordValidation),
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
    .withMessage("Active value is required. "),
];
const addNewRateStandard = [
  body("name").not().isEmpty().withMessage("Name is required."),
  body("hourRate").not().isEmpty().withMessage("Hour rate is required."),
  body("userId").not().isEmpty().withMessage("userId is required.")
]

const createCustomerValidation = [
  body("firstName")
    .not()
    .isEmpty()
    .withMessage(validationMessage.firstName)
    .trim()
];
const createNewLabourValidations = [
  body("discription").not().isEmpty().withMessage("Discription is required.").trim(),
  body("discription", "Discription should have atleast 20 wards and maximum 200 wards").isLength({ min: 20, max: 200 }).trim(),
  body("hours", "Hours should be numeric").isNumeric(),
  body("discount", "Discount should be numeric").isNumeric()
];
const updateLabourValidations = [
  body("discription").not().isEmpty().withMessage("Discription is required.").trim(),
  body("discription", "Discription should have atleast 20 wards and maximum 200 wards").isLength({ min: 20, max: 200 }).trim(),
  body("labourId").not().isEmpty().withMessage("Labour Id is required.").trim(),
  body("hours", "Hours should be numeric").isNumeric(),
  body("discount", "Discount should be numeric").isNumeric()
];
const createVendorValidations = [
  body("name").not().isEmpty().withMessage("Name is required.").trim(),
  body("accountNumber").not().isEmpty().withMessage("Account number is required.").trim(),
  body("accountNumber", "Account Number should be a number").isNumeric(),
  body("accountNumber", "Account Number must be between 12 to 17 number").isLength({ min: 12, max: 17 }).trim()
];
const updateVendorValidations = [
  body("name").not().isEmpty().withMessage("Name is required.").trim(),
  body("accountNumber").not().isEmpty().withMessage("Account number is required.").trim(),
  body("accountNumber", "Account Number should be a number").isNumeric(),
  body("accountNumber", "Account Number must be between 12 to 17 number").isLength({ min: 12, max: 17 }).trim(),
  body("vendorId").not().isEmpty().withMessage("Vendor Id is required.").trim(),
];
const createTierValidation = [
  body("brandName").not().isEmpty().withMessage("Brand name is required").trim(),
  body("brabdName", "Band name should be less than 100 wards").isLength({ max: 100 }).trim()
];
const updateTierValidation = [
  body("data.brandName").not().isEmpty().withMessage("Brand name is required").trim(),
  body("data.brabdName", "Band name should be less than 100 wards").isLength({ max: 100 }).trim()
];
module.exports = {
  signupValidation,
  signupConfirmation,
  loginValidation,
  forgotPasswordValidation,
  verifyLinkValidation,
  resetPasswordValidation,
  createUserValidation,
  updateUserValidation,
  userVerify,
  userVerifyLink,
  addNewRateStandard,
  createCustomerValidation,
  createNewLabourValidations,
  updateLabourValidations,
  createVendorValidations,
  updateVendorValidations,
  createTierValidation,
  updateTierValidation
};
