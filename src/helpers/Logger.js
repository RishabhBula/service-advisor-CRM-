import { EnviornmentTypes } from "../config/AppConfig";
export function logger() {
  if (process.env.NODE_ENV === EnviornmentTypes.DEV) {
    for (let index = 0; index < arguments.length; index++) {
      const data = arguments[index];
      console.log("====================================");
      console.log(data);
      console.log("====================================");
    }
  }
}
