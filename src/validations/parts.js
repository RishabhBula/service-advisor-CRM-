import { ValidationTypes } from "js-object-validation";

export const PartValidations = {
  partDescription: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.MINLENGTH]: 5,
    [ValidationTypes.MAXLENGTH]: 80
  },
  cost: {
    [ValidationTypes.NUMERIC]: true,
    [ValidationTypes.MINVALUE]: 1,
    [ValidationTypes.MAXLENGTH]: 6
  },
  price: {
    [ValidationTypes.NUMERIC]: true,
    [ValidationTypes.MINVALUE]: 1,
    [ValidationTypes.MAXLENGTH]: 6
  }
};
