import { ValidationTypes } from "js-object-validation";

export const VehicleValidations = {
  year: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.NUMERIC]: true 
  },
  make: {
    [ValidationTypes.REQUIRED]: true,
     [ValidationTypes.ALPHA]: true,
  },
  modal: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.ALPHA]: true,
  },
  miles: {
    [ValidationTypes.ALPHA]: true,
    [ValidationTypes.NUMERIC]: true
  }
};

export const VehicleValidationMessage = {
  year: {
    [ValidationTypes.REQUIRED]: "Please enter year.",
    [ValidationTypes.NUMERIC]: "Only numbers are allowed."  
  },
  make: {
    [ValidationTypes.REQUIRED]: "Please enter make.",
  },
  modal: {
    [ValidationTypes.REQUIRED]: "Please enter modal.",
  },
  miles: {
    [ValidationTypes.NUMERIC]: "Only numbers are allowed."
  }
};
