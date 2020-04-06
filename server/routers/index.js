const router = require('express').Router();
const { UserController, FoodController } = require('../controller/index')

// USER
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// FOOD
router.post('/foods', FoodController.create);
router.get('/foods', FoodController.getAll);


module.exports = router

// - route:
//   - `GET /foods`
// - request
//   - headers
//     - `{ access_token }`
// - response
//   - `200`: `[{ "id": 1, "title": "Ayam Bakar Madu", "price": 10000, "ingredients": "Ayam, Madu, Kecap", "tag": "ayam", "UserId": 1 }, ...]`

// notes :

// - Pastikan **hanya** user yang sedang login yang dapat mendapatkan data foods dan hanya foods dengan UserId sesuai user yang login.