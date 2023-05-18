const ApiError = require("../error/ApiError")
const { User } = require("../models/models")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signJWT = ({name, email, id, sex}) => {
  return jwt.sign(
      {name, email, id, sex}, 
      process.env.SECRET_KEY,
      {expiresIn: '48h'}
  )
}

class UserController {
  async regUser(req, res, next) {
    try {
      const { name, email, password } = req.body
      if (!name || !email || !password) {
        return next(ApiError.badRequest('Not all fields received'))
      }
      const checkEmail = await User.findOne({where: {email}})
      if (checkEmail) {
        return next(ApiError.badRequest('User with the same email already exists'))
      }
      const hashPassword = await bcrypt.hash(password, 3)
      await User.create({email, password: hashPassword, name})
      res.send({message: 'User created successfully'})
    } catch (e) {
      console.log(e);
      next(ApiError.badRequest(e.message))
    }
  }
  async logUser(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({where:{email}})
      if (!user) {
        return next(ApiError.badRequest('User not founded'))
      }
      const comparePasswd = bcrypt.compareSync(password, user.password)
      if (!comparePasswd) {
        return next(ApiError.badRequest('Wrong password'))
      }
      const token = signJWT({name: user.name, email: user.email, id: user.id, sex: user.sex})
      res.send(token)
    } catch (e) {
      console.log(e);
      next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new UserController()