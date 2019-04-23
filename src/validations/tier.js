import { ValidationTypes } from "js-object-validation";

export const CreateTierValidations = {
    brandName: {
        [ValidationTypes.REQUIRED]: true,
    }
};

export const CreateTierValidMessaages = {
    brandName: {
        [ValidationTypes.REQUIRED]: "Please enter barnd name.",
    }
};


