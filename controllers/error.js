exports.get404 = (req, res, next) => {
  const value = req.session.isLoggedIn;
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
    isLoggedIn: value,
  });
};
