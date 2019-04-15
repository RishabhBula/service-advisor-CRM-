import { ValidationTypes } from "js-object-validation";


export const vehicleValidation = {
  year: {
    [ValidationTypes.REQUIRED]: "Please enter year.",
     [ValidationTypes.ALPHA]: true,
  },
  make: {
    [ValidationTypes.REQUIRED]: "Please enter make.",
     [ValidationTypes.ALPHA]: true,
  },
  modal: {
    [ValidationTypes.REQUIRED]: "Please enter modal.",
    [ValidationTypes.ALPHA]: true,
  }
  miles: {
    [ValidationTypes.ALPHA]: true,
    [ValidationTypes.String]: "Please enter valid email address."
  }
};
