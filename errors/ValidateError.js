module.exports = class ValidationError extends Error {
  constructor(message) {
    super();
    this.status = 422;
    this.messageObject = message;
  }
};
