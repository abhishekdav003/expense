const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ExpenseDownload = sequelize.define("ExpenseDownload", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  fileKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ExpenseDownload;
