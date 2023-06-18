const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  host: "Smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "hoantran03082003@gmail.com",
    pass: "olxgvcxzfsnossrv",
  },
});
// authentication login
exports.getLogin = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isLoggedIn: false,
    errorMessage: message,
    email: "",
    errors: [],
    password: "",
  });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // all errors in Routes folder
  const errorValidation = validationResult(req);

  // whether exist any errors
  if (!errorValidation.isEmpty()) {
    // error message
    const message = `${validationResult(req).errors[0].msg}    
    ${validationResult(req).errors[0].path}`;
    // rerender with error
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/auth/login",
      isLoggedIn: false,
      errorMessage: message,
      email: email,
      password: password,
      errors: validationResult(req).array(),
    });
  }

  //find user with email in the request of form
  User.findOne({
    email: email,
  }).then((user) => {
    // we don't need to check user exist because we have checked in Routes

    // hash the password and compare with password in the database
    bcrypt
      .compare(password, user.password)
      .then((matchPassword) => {
        if (matchPassword) {
          //if password matched, save the session in the request and save session to the database
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((error) => {
            console.log(error);
            res.redirect("/");
          });
        }

        // whether we need to rerender with error message
        const message = "Wrong email or password.";
        return res.status(422).render("auth/login", {
          pageTitle: "Login",
          path: "/auth/login",
          isLoggedIn: false,
          errorMessage: message,
          email: email,
          errors: [],
          password: password,
        });
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/login");
      });
  });
};

exports.postLogout = (req, res) => {
  req.session.user = new User().init(req.session.user);
  req.session.destroy((error) => {
    res.redirect("/login");
  });
};

exports.getSignUp = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) message = message[0];
  else message = null;
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/auth/signup",
    isLoggedIn: false,
    errorMessage: message,
  });
};

exports.postSignUp = (req, res) => {
  const name = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;
  const errorValidation = validationResult(req);
  const confirmPassword = req.body.confirmPassword;
  if (!errorValidation.isEmpty()) {
    const message = `${validationResult(req).errors[0].msg}    
    ${validationResult(req).errors[0].path}`;
    return res.status(422).render("auth/signup", {
      pageTitle: "Sign Up",
      path: "/auth/signup",
      isLoggedIn: false,
      errorMessage: message,
      email: email,
      password: password,
      name: name,
      confirmPassword: confirmPassword,
    });
  }

  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transporter.sendMail({
        from: "hoantran03082003@gmail.com",
        to: email,
        subject: "Signup succeeded!",
        html: "<h1>You successfully signed up!</h1>",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getForgotPassword = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/forgotPassword", {
    path: "/auth/forgot-password",
    pageTitle: "Reset Password",
    isLoggedIn: false,
    errorMessage: message,
  });
};

exports.postForgotPassword = (req, res) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      return res.redirect("/forgot-password");
    }
    const token = buffer.toString("hex");
    const tokenExpired = Date.now() + 3600000;

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that Email !");
          return res.redirect("/forgot-password");
        }
        user.resetToken = token;
        user.resetExpiredTime = tokenExpired;
        return user.save().then((result) => {
          // send mail
          return transporter.sendMail({
            from: "hoantran03082003@gmail.com",
            to: req.body.email,
            subject: "Reset password",
            html: `<p>You request to reset password</p>
            <p>please click to link below to reset your password</p>
            <a href="http://localhost:3000/reset/${token}">http://localhost:3000/reset/${token}<a/>
            `,
          });
        });
      })
      .then((result) => {})
      .catch((error) => {
        console.log(error);
      });
  });
};

exports.getReset = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    isLoggedIn: false,
    errorMessage: message,
    resetToken: req.params.resetPasswordToken,
  });
};

exports.postReset = (req, res) => {
  const resetToken = req.body.resetToken;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  let userOld;
  if (newPassword !== confirmPassword) {
    req.flash("error", "Password Confirm is not correct ! ");
    return res.redirect(`/reset/${resetToken}`);
  }
  User.findOne({ resetToken: resetToken })
    .then((user) => {
      if (user.resetExpiredTime <= Date.now()) {
        req.flash("error", "Reset Token Was Expired ! ");
        return res.redirect("/login");
      }
      userOld = user;
      bcrypt
        .hash(req.body.newPassword, 12)
        .then((hashPass) => {
          userOld.password = hashPass;
          return userOld.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((error) => {
      console.log(error);
    });
};
