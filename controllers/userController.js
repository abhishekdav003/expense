const userService = require("../services/userService")

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:"All fields are required"
      })
    }
    const user = await userService.signup(name, email, password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        name: user.name,
        email:user.email
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

const login = async (req, res) => {
  try {
    
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:"Email and password are required"
      })
    }

    const user = await userService.login(email, password)

    res.status(200).json({
      success: true,
      message: "Login sucessfull",
      data: {
        id: user.id,
        name: user.name,
        email:user.email
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message:error.message
    })
  }
}

module.exports = {
  signup, login
};