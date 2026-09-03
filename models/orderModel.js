const { DataTypes } = require('sequelize')

const sequelize = require("../config/db")

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull:false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue:"INR"
  },
  status: {
    type: DataTypes.STRING,
    defaultValue:"PENDING"
  },
  paymentSessionId: {
    type: DataTypes.INTEGER,
    allowNull:true
  }
})

module.exports = Order