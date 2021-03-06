var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var loggedUserId;
//var loggedUserName;

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var userRouter = require('./routes/user');
var productRouter = require('./routes/products');
var reciboRouter = require('./routes/recibo');
var ordenesRouter = require('./routes/ordenes');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Miguel:Mmongo909192939495@cluster0-sicrg.mongodb.net/Prueba?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(()=> {
  console.log("Connected to my database");
});

/*mongoose.connect('mongodb+srv://junovicz:yasemeolvido@nocturnecluster-9fgvr.mongodb.net/test?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> {
  console.log("Connected to julio database");
});*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/', loginRouter);
app.use('/login/signup', signupRouter);
app.use('/user', userRouter);
app.use('/producto', productRouter);
app.use('/recibo', reciboRouter);
app.use('/ordenes', ordenesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
