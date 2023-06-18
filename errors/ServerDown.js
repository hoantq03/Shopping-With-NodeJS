module.exports = class ServerDown extends Error {
  constructor(message) {
    super();
    this.status = 500;
    this.messageObject = message;
  }
};
