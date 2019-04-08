export const EnviornmentTypes = {
  DEV: "development",
  PROD: "production",
};
export const mode = process.env.NODE_ENV || EnviornmentTypes.DEV; //stage,dev,live
export const isProd = mode === EnviornmentTypes.PROD;
let data;

switch (mode) {
  case EnviornmentTypes.PROD:
    data = {};
    break;
  case EnviornmentTypes.DEV:
    data = {
      API_ENDPOINT: "http://192.168.2.117:8001/",
      API_VERSION: "api",
    };
    break;
  default:
    data = {};
    break;
}
data.DEFAULT_DATE_FORMAT = "LLL";
export const AppConfig = data;
