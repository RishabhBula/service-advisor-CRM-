const validationMessage = {
  emailValidation: "Please enter email address.",
  emailInvalid: "Please enter a valid email address.",
  emailAlreadyExist: "Email address already exist.",
  passwordValidation: "Please enter a password.",
  firstName: "Please enter your first name.",
  firstnameLetter: "First name should contain all the letters.",
  lastName: "Please enter your last name.",
  lastnameLetter: "Last name should contain all the letters.",
  numberValidation: "Please enter Mobile No.",
  numberInvalid: "Please enter a valid Mobile No.",
  minimumPasswordValidation:
    "Please enter the password with minimum 6 characters.",
  confirmPassword: "Please enter the same password again.",
  sessionExpire: "Session has been Expired.",
  tokeExpire: "Token has been Expired.",
  addressValidation: "Please enter the address.",
  cityValidation: "Please enter the city.",
  stateValidation: "Please select the state.",
  postalValidation: "Please enter the valid postal code."
};

const otherMessage = {
  newRegister: "You have Succesfully Registered.",
  confirmMessage: "A confirmation link has been sent to your email id.",
  insertUserMessage:
    "User was successfully added.<br/>A confirmation link has been sent to user email id.",
  userPasswordCreation: "Your password was successfully created.",
  linkExpiration: "Link has been expired."
};
module.exports = {
  validationMessage,
  otherMessage
};