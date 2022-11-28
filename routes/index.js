var express = require('express');
var router = express.Router();
const authRouter=require('./authRoutes')
var usersRouter = require('./users');
const {requireAuth,checkUser}=require('../middlewares/auth')

/* GET home page. */

router.get('*',checkUser)
router.get('/',requireAuth, function(req, res, next) {
  res.render('home', { title: 'Express' });
});

router.get('/home',requireAuth, function(req, res, next) {
  res.render('home');
});

router.use('/users', usersRouter);
router.use(authRouter)
module.exports = router;
