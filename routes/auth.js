const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignUp);

router.post("/signup", authController.postSignUp);

router.get("/forgot-password", authController.getForgotPassword);

router.post("/forgot-password", authController.postForgotPassword);

router.get("/reset/:resetPasswordToken", authController.getReset);

router.post("/changePassword", authController.postReset);

module.exports = router;
