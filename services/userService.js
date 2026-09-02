const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const signup = async (name, email, password) => {
  const existingUser = await User.findOne({
    where: {
      email
    }
  })
  if (existingUser) {
    throw new Error("User Already exists")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword
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

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    throw new Error("Invalid password")
  }

  const token = jwt.sign(
    {
      id: user.id,
      email:user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:"1d"
    }
  )
  return {
    user, token
  }
}
module.exports = { signup, login}