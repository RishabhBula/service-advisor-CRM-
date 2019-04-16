import { ValidationTypes } from "js-object-validation";

export const CreateCustomerValidations = {
  firstName: {
    [ValidationTypes.REQUIRED]: true,
  },
  lastName: {
    [ValidationTypes.REQUIRED]: true,
  },
  email:{
    [ValidationTypes.EMAIL]: true
  }
};

export const CreateCustomerValidMessaages = {
  firstName: {
    [ValidationTypes.REQUIRED]: "Please enter first name.",
  },
  lastName: {
    [ValidationTypes.REQUIRED]: "Please enter last name.",
  },
  email:{
    [ValidationTypes.EMAIL]: "Please enter valid email address."
  }
};


