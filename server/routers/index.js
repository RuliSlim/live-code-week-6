const router = require('express').Router();
const { UserController } = require('../controller/index')

router.post('/register', UserController.register);
router.post('/login', UserController.login);