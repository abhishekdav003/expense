require('dotenv').config()
const cors = require("cors")

const express = require("express")
const sequelize = require("./config/db")
const userRoute = require("./routes/userRoute")
const expenseRoute = require("./routes/expenseRoute")
const User = require("./models/userModel");
const Order = require("./models/orderModel");
const orderRoute = require("./routes/orderRoute");

// Relationship
User.hasMany(Order, {
  foreignKey: "userId",
});

Order.belongsTo(User, {
  foreignKey: "userId",
});

// Database sync
sequelize.sync();
const app = express()
app.use(cors())
app.use(express.json())
app.use("/user", userRoute)
app.use("/expense", expenseRoute)
app.use("/order", orderRoute);
app.get("/", (req, res) => {
  res.send("User Signup is running is running")
})

const port = process.env.PORT || 4000

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log("Database connected Sucessfully")
    await sequelize.sync()
    console.log("database synced successfully")
    app.listen(port, () => {
      console.log(`server is running on port ${port}`)
    })

  } catch (error) {
    console.error("Database connection failed",error.message)
  }
}
startServer()