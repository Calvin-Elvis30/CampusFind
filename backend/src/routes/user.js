const express = require('express')

const router = express.Router()

// local imports 
const { register, login } = require('../controllers/user')

router.route('/register').post(register)
router.route('/login').post(login)

module.exports = router