class HttpError extends Error {
  constructor(message, details, errorCode) {
    super(message);
    this.details = details;
    this.code = errorCode;
  }
}

module.exports = HttpError;
