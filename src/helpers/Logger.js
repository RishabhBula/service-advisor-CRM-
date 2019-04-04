import { EnviornmentTypes } from "../config/AppConfig";
export const logger = data => {
  if (process.env.NODE_ENV === EnviornmentTypes.DEV) {
    console.log("====================================");
    console.log(data);
    console.log("====================================");
  }
};
