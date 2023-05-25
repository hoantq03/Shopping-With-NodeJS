exports.pageNotFound = (req, res) => {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: "404" });
};
