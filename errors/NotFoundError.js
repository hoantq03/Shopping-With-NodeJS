module.exports = class NotFoundError extends Error {
  constructor(message) {
    super();
    this.status = 404;
    this.messageObject = message;
  }
};
