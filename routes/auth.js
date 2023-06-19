const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const { check, body } = require("express-validator");
const User = require("../models/user");
require("express-async-errors");

router.get("/login", authController.getLogin);

router.post(
  "/login",
  body("email")
    .isEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (!userDoc) {
          return Promise.reject("E-mail incorrect");
        }
      });
    }),
  body("password")
    .isLength({ min: 5, max: 16 })
    .withMessage(
      "Please enter password width min length : 5 character, max length : 16 character"
    )
    .isAlphanumeric(),
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignUp);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail exist already, please pick another one"
            );
          }
        });
      }),
    body("password")
      .isLength({ min: 5, max: 16 })
      .withMessage(
        "Please enter password width min length : 5 character, max length : 16 character"
      )
      .isAlphanumeric(),
    body("confirmPassword")
      .isLength({ min: 5, max: 16 })
      .withMessage(
        "Please enter password width min length : 5 character, max length : 16 character"
      )
      .isAlphanumeric(),
  ],
  authController.postSignUp
);

router.get("/forgot-password", authController.getForgotPassword);

router.post("/forgot-password", authController.postForgotPassword);

router.get("/reset/:resetPasswordToken", authController.getReset);

router.post("/changePassword", authController.postReset);

module.exports = router;
