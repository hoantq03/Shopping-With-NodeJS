const User = require("../models/user");

// authentication login
exports.getLogin = (req, res) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isLoggedIn: false,
  });
};

exports.postLogin = (req, res) => {
  User.findById("6483474c6e79ccaff994fe2b")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      console.log("logging is accepted");
      req.session.save((error) => {
        console.log(error);
        res.redirect("/");
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postLogout = (req, res) => {
  req.session.user = new User().init(req.session.user);
  req.session.destroy((error) => {
    res.redirect("/");
  });
};
