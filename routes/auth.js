const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const { check, body } = require("express-validator");
const User = require("../models/user");

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid Email")
      .normalizeEmail()
      .trim(),
    body("password")
      .isLength({ min: 5, max: 16 })
      .withMessage(
        "Please enter password width min length : 5 character, max length : 16 character"
      )
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignUp);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter the valid Email")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail exist already, please pick another one"
            );
          }
        });
      })
      .trim(),
    body("password")
      .isLength({ min: 5, max: 16 })
      .withMessage(
        "Please enter password width min length : 5 character, max length : 16 character"
      )
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password must match ");
        }
      })
      .trim(),
  ],
  authController.postSignUp
);

router.get("/forgot-password", authController.getForgotPassword);

router.post("/forgot-password", authController.postForgotPassword);

router.get("/reset/:resetPasswordToken", authController.getReset);

router.post("/changePassword", authController.postReset);

module.exports = router;
