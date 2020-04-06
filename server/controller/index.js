const { User, Food } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const signToken = (user) => {
  payload = {
    iss: 'TotalSlim',
    id: user.id,
    iat: new Date()
  };
  return jwt.sign(payload, 'secret', {expiresIn: '1h'});
}

class UserController {
  static register(req, res, next) {
    const { email, password } = req.body
    User.create({email, password})
      .then(user => {
        const token = signToken(user);
        res.status(201).json({user: user.id, token});
      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
  }

  static login(req, res, next) {
    const { email, password } = req.body
    User.findOne({where: {email}})
      .then(user => {
        if(user) {
          if(bcrypt.compareSync(password, user.password)) {
            const token = signToken(user)
            res.status(200).json({user: user.id, token});
          } else {
            throw new Error('Password Or email Wrong')
          }
        } else {
          throw new Error('User not found')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}

module.exports = {
  UserController
}
