var express = require('express');
var router = express.Router();
const AuthController=require('../controllers/authController')

/* GET users listing. */
router.get('/login', AuthController.login_get);
router.post('/login',AuthController.login_post)
router.get('/signup',AuthController.signup_get)
router.post('/signup',AuthController.signup_post)
router.get('/logout',AuthController.logout)

module.exports = router;