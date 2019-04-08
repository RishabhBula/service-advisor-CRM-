import * as moment from "moment";
import { AppConfig } from "../config/AppConfig";

export const formateDate = date => {
  return moment(new Date(date)).format(AppConfig.DEFAULT_DATE_FORMAT);
};
