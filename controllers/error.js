exports.get404 = (req, res, next) => {
  const value = req.session.isLoggedIn;
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
    isLoggedIn: value,
  });
};

exports.get500 = (req, res, next) => {
  const value = req.session.isLoggedIn;
  res.status(500).render("500", {
    pageTitle: "Error ( 500 )",
    path: "/500",
    isLoggedIn: value,
  });
};
