const User = require("../models/user");
const bcrypt = require("bcryptjs");
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
  const password = req.body.password;
  User.findOne({
    email: email,
  })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password).then((result) => {
          if (result) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            console.log("logging is accepted");
            req.session.save((error) => {
              console.log(error);
              res.redirect("/");
            });
          } else {
            console.log("logging is rejected");
            res.redirect("/login");
          }
        });
      } else {
        console.log("logging is rejected");
        res.redirect("/login");
      }
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

exports.getSignUp = (req, res) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/auth/signup",
    isLoggedIn: false,
  });
};

exports.postSignUp = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const name = req.body.userName;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.redirect("/login");
      }
      if (password === confirmPassword) {
        bcrypt.hash(password, 12).then((hashPassword) => {
          user = new User({
            name: name,
            email: email,
            password: hashPassword,
            cart: { items: [] },
          });
          return user.save();
        });
      } else {
        return res.redirect("/signup");
      }
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((error) => {
      console.log(error);
    });
};
