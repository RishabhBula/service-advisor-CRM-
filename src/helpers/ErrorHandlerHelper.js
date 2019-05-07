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
    data: undefined
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
      this.rawError.data &&
      typeof this.rawError.data === "object" &&
      this.rawError.data.message
    ) {
      this.error.messages.push(this.rawError.data.message);
    }
    if (!this.error.messages.length) {
      this.error.error = "Unknown";
      this.error.messages = ["An unexpected error occured."];
    }
  };
}
