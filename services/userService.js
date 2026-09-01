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

module.exports = { signup }