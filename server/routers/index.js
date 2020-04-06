const router = require('express').Router();
const { UserController, FoodController } = require('../controller/index')

// USER
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// FOOD
router.post('/foods', FoodController.create);
router.get('/foods', FoodController.getAll);
router.delete('/foods/:id', FoodController.destroyFood);


module.exports = router