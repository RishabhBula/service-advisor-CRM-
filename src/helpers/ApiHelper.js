import { AppConfig } from "../config/AppConfig";
import { ErrorHandlerHelper } from "./ErrorHandlerHelper ";
import { SuccessHandlerHelper } from "./SuccessHandlerHelper";

/**
 * ApiHelper Class - For making Api Requests
 */
export class ApiHelper {
  _portalGateway;
  _apiVersion;

  constructor() {
    this._portalGateway = AppConfig.API_ENDPOINT;
    this._apiVersion = AppConfig.API_VERSION;
  }
  setHost = host => {
    this._portalGateway = host;
  };
  setApiVersion = version => {
    this._apiVersion = version;
  };
  /**
   * Fetches from the Gateway defined by the instantiated object. Accepts <T> as output object.
   * @example <caption>"/Auth/UserAccount", "/GetCurrentUser", "GET", "JWT Content"</caption>
   * @param {service} service - wanting to be access ex. "UserAuth/Auth"
   * @param {endpoint} endpoint - you wish to call ex. "/Login"
   * @param {method} mehotd - method (GET, UPDATE, DELETE, POST)
   * @param {jwt} JWT - JSON Web Token (Optional)
   * @param {queryOptions} Query - query options for "GET" methods (Optional)
   * @param {body} body - JSON body for "UPDATE, DELETE and POST" methods (Optional)
   */
  async FetchFromServer(
    service,
    endpoint,
    method,
    authenticated = false,
    queryOptions = undefined,
    body = undefined
  ) {
    let options = { method: method };
    let url = this._portalGateway + this._apiVersion + service + endpoint;
    options.headers = new Headers();
    options.headers.append("Content-Type", "application/json");
    if (authenticated) {
      const storageSession = JSON.parse(
        localStorage.getItem("localStorageVal")
      );
      options.headers.append(
        "Authorization",
        storageSession ? storageSession.token : undefined
      );
    }

    // html query for "GET", json body for others.
    if (method === "GET") {
      let isFirst = true;
      if (queryOptions && typeof queryOptions === "object") {
        for (const i in queryOptions) {
          if (queryOptions[i]) {
            const e = queryOptions[i];
            if (isFirst) {
              isFirst = false;
              url += "?";
            } else {
              url += "&";
            }
            url += i + "=" + e;
          }
        }
      }
    }
    if (method === "DELETE") {
      let isFirst = true;
      if (queryOptions && typeof queryOptions === "object") {
        for (const i in queryOptions) {
          if (queryOptions.hasOwnProperty(i)) {
            const e = queryOptions[i];
            if (isFirst) {
              isFirst = false;
              url += "?";
            } else {
              url += "&";
            }
            url += i + "=" + e;
          }
        }
      }
    } else {
      options.body = JSON.stringify(body);
    }
    try {
      let response = await fetch(url, options);
      let responseObject;

      try {
        responseObject = await response.json();
      } catch (error) {
        responseObject = {};
      }
      if (response.ok === false || response.status !== 200) {
        let errorObject = {
          code: response.status,
          responseObject
        };

        throw errorObject;
      }

      const data = new SuccessHandlerHelper(responseObject);

      return data.data;
    } catch (err) {
      const errorHelper = new ErrorHandlerHelper(err);
      return errorHelper.error;
    }
  }
}
