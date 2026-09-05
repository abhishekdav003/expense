const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Income = sequelize.define("Income", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  source: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Income;
