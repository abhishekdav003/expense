const User = require("../models/userModel")

const signup = async (name, email, password) => {
  const existingUser = await User.findOne({
    where: {
      email
    }
  })
  if (existingUser) {
    throw new Error("User Already exists")
  }

  const user = await User.create({
    name,
    email,
    password
  })
  return user
}

const login = async (email, password) => {
  const user = await User.findOne({
    where: {
      email,
    }
  })
  if (!user) {
    throw new Error("User not Found.")
  }

  if (user.password !== password) {
    throw new Error("Invalid password")
  }
  return user
}
module.exports = { signup, login}