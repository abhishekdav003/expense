const User = require("../models/userModel");

const premiumUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isPremium) {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for Premium users",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to check premium status",
    });
  }
};

module.exports = premiumUser;
