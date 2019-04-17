import { ValidationTypes } from "js-object-validation";

export const CreateUserValidations = {
  firstName: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.MAXLENGTH]: 100,
    [ValidationTypes.ALPHA]: true
  },
  lastName: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.MAXLENGTH]: 100,
    [ValidationTypes.ALPHA]: true
  },
  email: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.EMAIL]: true,
    [ValidationTypes.MAXLENGTH]: 100
  },
  type: {
    [ValidationTypes.REQUIRED]: true
  },
  rate: {
    [ValidationTypes.MAXVALUE]: 1000
  }
};

export const CreateUserValidationsMessaages = {
  firstName: {
    [ValidationTypes.REQUIRED]: "Please enter first name.",
    [ValidationTypes.MAXLENGTH]:
      "First name cannot have more that 100 characters.",
    [ValidationTypes.ALPHA]:
      "First name should be alphabatic and should not contain spaces."
  },
  lastName: {
    [ValidationTypes.REQUIRED]: "Please enter last name.",
    [ValidationTypes.MAXLENGTH]:
      "Last name cannot have more that 100 characters.",
    [ValidationTypes.ALPHA]:
      "Last name should be alphabatic and should not contain spaces."
  },
  email: {
    [ValidationTypes.REQUIRED]: "Please enter email.",
    [ValidationTypes.EMAIL]: "Please enter a valid email.",
    [ValidationTypes.MAXLENGTH]: "Email cannot have more that 100 characters."
  },
  type: {
    [ValidationTypes.REQUIRED]: "Please enter select user type."
  },
  rate: {
    [ValidationTypes.MAXVALUE]: "Rate cann't be more than $1000."
  }
};
