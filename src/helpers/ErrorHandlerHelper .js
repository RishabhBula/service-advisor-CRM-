/**
 * ErrorHandlerHelper Class - For managing errors
 */
export class ErrorHandlerHelper {
  rawError;
  error = {
    code: 500,
    isError: true,
    timestamp: Date.now(),
    error: "Unknown error",
    messages: [],
    data: undefined,
  };
  constructor(err) {
    this.rawError = err;
    this.setError();
  }

  setError = () => {
    this.error.code = this.rawError.code ? this.rawError.code : this.error.code;
    this.error.timestamp = Date.now();
    this.error.messages = [];
    if (
      this.rawError.responseObject &&
      typeof this.rawError.responseObject === "object" &&
      this.rawError.responseObject.message
    ) {
      this.error.messages.push(this.rawError.responseObject.message);
    }
    if (!this.error.messages.length) {
      this.error.error = "Unknown";
      this.error.messages = ["An unexpected error occured."];
    }
  };
}
