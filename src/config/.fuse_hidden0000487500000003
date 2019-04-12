import { logger } from "../helpers/Logger";

export const EnviornmentTypes = {
    DEV: "development",
    PROD: "production",
};
export const mode = process.env.NODE_ENV || EnviornmentTypes.DEV; //stage,dev,live
export const isProd = mode === EnviornmentTypes.PROD;
let data;
data = {
API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT,
API_VERSION: process.env.REACT_APP_API_VERSION,
phoneLength: 3,
DEFAULT_DATE_FORMAT: "LLL",
ITEMS_PER_PAGE: 5,
};
export const AppConfig = data;