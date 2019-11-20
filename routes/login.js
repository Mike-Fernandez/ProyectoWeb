var express = require('express');
var router = express.Router();
var userController = require('../controller/api/userController');
const User = require('../models/Usuario');


/* GET login page. */
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Express' });
});


router.post('/',function (req, res, next) {
  console.log(req.body.username);
  userController.Login(req,res,next);
});

router.post('/signup', function (req, res, next) {
  res.render('signup', {title:'Express'});
});

module.exports = router;
