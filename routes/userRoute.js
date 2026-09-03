const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getUserProfile,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);

// Get logged-in user details
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
