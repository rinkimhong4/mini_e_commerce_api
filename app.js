var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productRoute = require('./routes/product.route');
const orderRoute = require('./routes/order.route');
const cartRoute = require('./routes/cart.route');

// Load models and associations
const db = require('./models');

var app = express();
// Allow all origins (useful for mobile apps)

app.use(cors());

// OR restrict to specific origins (for web)
var corsOptions = {
   origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/upload", express.static("upload"));

// Configure authentication routes (after middleware)
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('', productRoute);
app.use('/', orderRoute);
app.use('/', cartRoute);

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
