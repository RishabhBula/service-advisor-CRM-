const mode = "stage"; //stage,dev,live
export const isProd = mode === "live";
let data;

switch (mode) {
  case "live":
    data = {
    };
    break;
  case "stage":
    data = {
    };
    break;
  case "dev":
    data = {
      API_ENDPOINT: "https://192.168.2.117:8001/",
      API_VERSION: "api",
      frontUrl: "",
      backUrlApi: "https://192.168.2.117:8000/api",
    };
    break;
  default:
    data = {};
    break;
}

export const AppConfig = data;
