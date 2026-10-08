// dependencies
const { StatusCodes } = require('http-status-codes')

// local imports
const User = require('../model/user')

// new user sign in
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
      throw new Error('fill in the required details')
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User already exists' })
    }

    const user = await User.create({ firstName, lastName, email, password })
    const token = await user.getJWT()

    res.status(StatusCodes.OK).json({ msg: { id: user._id, token } })
  } catch (error) {
    next(error)
  }
}

// login user

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new Error('Fill in details please !')
    }

    // find user
    const user = await User.findOne({ email })

    //check if usr exists
    if (!user) {
      throw new Error(' Invalid email or password ')
    }

    // compare passwords
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: ' Invalid email or password ' })
    }

    const token = await user.getJWT()

    res.status(StatusCodes.OK).json({ msg: { id: user._id, token } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
}
