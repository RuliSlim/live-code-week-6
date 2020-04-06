const { User, Food } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const signToken = (user) => {
  payload = {
    iss: 'TotalSlim',
    id: user.id,
    iat: new Date().getTime()
  };
  return jwt.sign(payload, 'secret', {expiresIn: '1h'});
}

class UserController {
  static register(req, res, next) {
    const { email, password } = req.body
    User.create({email, password})
      .then(user => {
        const token = signToken(user);
        res.status(201).json({access_token: token});
      })
      .catch(err => {
        if(err.name === 'SequelizeValidationError') {
          return res.status(404).json({message: 'Email or Password are required'})
        }
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
            res.status(200).json({access_token: token});
          } else {
            throw new Error('Password Or email Wrong')
          }
        } else {
          throw new Error('User not found')
        }
      })
      .catch(err => {
        if(err.message == 'User not found') {
          return res.status(404).json({ message: err.message })
        }
        if(err.message == 'Password Or email Wrong') {
          return res.status(400).json({ message: err.message })
        }
        res.status(500).json(err)
        console.log(err)
      })
  }
}

class FoodController{
  static create(req, res, next) {
    const {title, price, ingredients, tag} = req.body
    console.log('masuk ga?')
    console.log(req.body, 'body')
    console.log(req.headers, 'headers')

    // middleware
    const token = req.headers.access_token
    console.log(token, 'token')
    let user = jwt.verify(token, 'secret', {expiresIn: '1h'}).id
    // const user = 
    console.log(user, 'user')
    if (token) {
      Food.create({title, price, ingredients, tag, UserId: user})
        .then(food => {
          res.status(201).json({ food})
        })
        .catch(err => {
          res.status(500).json(err)
        })
    } else {
      res.status(400).json({ message: 'You have to Login' })
    }
  }

  static getAll(req, res, next) {
    // middleware
    console.log(req.headers, 'headers')
    if(req.headers.access_token) {
      const token = req.headers.access_token
      console.log(token, 'token')
      let user = jwt.verify(token, 'secret', {expiresIn: '1h'}).id

      // 
      Food.findAll({where: {UserId: user}})
        .then(foods => {
          res.status(200).json({foods})
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({err})
        })
    } else {
      res.status(400).json({ message: 'You Have To Login' })
    }
  }
  
  static destroyFood(req, res, next) {
    // middleware
    if(req.headers.access_token) {
      const token = req.headers.access_token
      let user = jwt.verify(token, 'secret', {expiresIn: '1h'}).id
      let foundFood
      // 
      Food.findOne({where: {id: req.params.id}})
        .then(food => {
          // console.log(food, 'food nih')
          foundFood = food
          if(food.UserId === user) {
            return Food.destroy({where: {id: req.params.id}})
          } else {
            throw new Error('You are not authorized')
          }
        })
        .then(food => {
          res.status(200).json({ message: 'Successfully delete food from your menu'})
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({err})
        })
    } else {
      res.status(400).json({ message: 'You Have To Login' })
    }
  }
}

module.exports = {
  UserController,
  FoodController
}

// ## **Release 4 - Delete Food**

// ### **Server**

// Buatlah endpoint untuk menghapus food dari user yang sedang login dengan ketentuan sebagai berikut:

// - route:
//   - `DELETE /foods/:id`
// - request
//   - headers
//     - `{ access_token }`
// - response:
//   - `200`: `{ "message": "Successfully delete food from your menu"  }`

// notes : 
// - Pastikan disisi server maupun client user **HANYA** bisa menghapus food miliknya sendiri (Authorization)