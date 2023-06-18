const NotFoundError = require("../errors/notFoundError");

exports.pageNotFound = (req, res) => {
  throw new NotFoundError("Page not found");
};
