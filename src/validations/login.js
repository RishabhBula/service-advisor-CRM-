import { ValidationTypes } from "js-object-validation";

export const LoginValidations = {
  email: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.EMAIL]: true,
    [ValidationTypes.MAXLENGTH]: 100,
  },
  password: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.MINLENGTH]: 6,
    [ValidationTypes.MAXLENGTH]: 20,
  },
};

export const LoginValidationsMessaages = {
  email: {
    [ValidationTypes.REQUIRED]: "Please enter email.",
    [ValidationTypes.EMAIL]: "Please enter a valid email.",
    [ValidationTypes.MAXLENGTH]: "Email cannot have more that 100 characters.",
  },
  password: {
    [ValidationTypes.REQUIRED]: "Please enter password.",
    [ValidationTypes.MINLENGTH]:
      "Password should be atleast 6 characters long.",
    [ValidationTypes.MAXLENGTH]: "Password cannot have more that 20 characters",
  },
};

export const ForgetPasswordValidations = {
  email: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.EMAIL]: true,
    [ValidationTypes.MAXLENGTH]: 100,
  },
};

export const ForgetPasswordValidationsMessaages = {
  email: {
    [ValidationTypes.REQUIRED]: "Please enter email.",
    [ValidationTypes.EMAIL]: "Please enter a valid email.",
    [ValidationTypes.MAXLENGTH]: "Email cannot have more that 100 characters.",
  },
};

export const ResetPasswordValidations = {
  password: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.MINLENGTH]: 6,
    [ValidationTypes.MAXLENGTH]: 20,
  },
  confirmPassword: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.EQUAL]: "password",
  },
};

export const ResetPasswordValidationsMessaages = {
  password: {
    [ValidationTypes.REQUIRED]: "Please enter password.",
    [ValidationTypes.MINLENGTH]:
      "Password should be atleast 6 characters long.",
    [ValidationTypes.MAXLENGTH]: "Password cannot have more that 20 characters",
  },
  confirmPassword: {
    [ValidationTypes.REQUIRED]: "Please enter confirm password.",
    [ValidationTypes.EQUAL]: "Password and confirm password didn't match.",
  },
};
