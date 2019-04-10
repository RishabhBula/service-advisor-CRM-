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
      API_ENDPOINT: "http://localhost:8001/",
      API_VERSION: "api",
      phoneLength: 3,
    };
    break;
  default:
    data = {};
    break;
}
data.DEFAULT_DATE_FORMAT = "LLL";
data.ITEMS_PER_PAGE = 5;
export const AppConfig = data;
