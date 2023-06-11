// authentication login
exports.getLogin = (req, res) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isLoggedIn: false,
  });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  res.setHeader("set-cookie", "isLoggedIn=true");
  res.redirect("/");
};
