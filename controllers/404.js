const NotFoundError = require("../errors/notFoundError");
require("express-async-errors");

exports.pageNotFound = (req, res) => {
  throw new NotFoundError("Page not found");
};
