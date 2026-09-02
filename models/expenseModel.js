const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const Expense = sequelize.define("Expense", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:true
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull:false
  },
  description: {
    type: DataTypes.STRING,
    allowNull:false
  },
  category: {
    type: DataTypes.ENUM(
      "Food",
      "Petrol",
      "Salary",
      "Shopping",
      "Other"
    ),
    allowNull:false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull:false
  }
})

module.exports = Expense