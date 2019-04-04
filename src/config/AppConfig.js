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
      API_ENDPOINT: "https://192.168.2.117:8001/",
      API_VERSION: "api",
    };
    break;
  default:
    data = {};
    break;
}

export const AppConfig = data;
