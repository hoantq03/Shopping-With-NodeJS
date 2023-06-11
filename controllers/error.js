exports.get404 = (req, res, next) => {
  const value =
    req.get("Cookie")?.split(";")[0]?.trim()?.split("=")[1] === "true";
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
    isLoggedIn: value,
  });
};
