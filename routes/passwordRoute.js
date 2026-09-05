const express = require("express");

const router = express.Router();

const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");

router.post("/forgotpassword", forgotPassword);

router.post("/resetpassword/:token", resetPassword);

module.exports = router;
