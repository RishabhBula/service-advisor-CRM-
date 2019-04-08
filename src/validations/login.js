import { ValidationTypes } from "js-object-validation";

export const LoginValidations = {
  email: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.EMAIL]: true,
    [ValidationTypes.MAXLENGTH]: 100,
  },
  password: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.MAXLENGTH]: 20,
    [ValidationTypes.PASSWORD]: true,
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
    [ValidationTypes.MAXLENGTH]: "Password cannot have more that 20 characters",
    [ValidationTypes.PASSWORD]:
      "Please choose a strong password. Must have one lowercase, one upercase, one number, one special and should have at least 8 characters.",
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
    [ValidationTypes.MAXLENGTH]: 20,
    [ValidationTypes.PASSWORD]: true,
  },
  confirmPassword: {
    [ValidationTypes.REQUIRED]: true,
    [ValidationTypes.EQUAL]: "password",
  },
};

export const ResetPasswordValidationsMessaages = {
  password: {
    [ValidationTypes.REQUIRED]: "Please enter password.",
    [ValidationTypes.PASSWORD]:
      "Please choose a strong password. Must have one lowercase, one upercase, one number, one special and should have at least 8 characters.",
    [ValidationTypes.MAXLENGTH]: "Password cannot have more that 20 characters",
  },
  confirmPassword: {
    [ValidationTypes.REQUIRED]: "Please enter confirm password.",
    [ValidationTypes.EQUAL]: "Password and confirm password didn't match.",
  },
};
