var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./models/index').sequelize;
const flash = require("connect-flash");
const session = require("express-session");

var indexRouter = require('./routes/registrarRouter');
var clienteRouter = require('./routes/clienteRouter');
var empleadoGestionRouter = require('./routes/empleadoGestionRouter');
var empleadoHelpdeskRouter = require('./routes/empleadoHelpdeskRouter');
var empleadoCalidadRouter = require('./routes/empleadoCalidadRouter');
var empleadoComunRouter = require('./routes/empleadoComunRouter');
var ClienteAutenticado = require("./routes/clienteRouter").ClienteAutenticado;
var EmpleadoComunAutenticado = require("./routes/empleadoComunRouter").EmpleadoComunAutenticado;
var EmpleadoCalidadAutenticado = require("./routes/empleadoCalidadRouter").EmpleadoCalidadAutenticado;
var EmpleadoGestionAutenticado = require("./routes/empleadoGestionRouter").EmpleadoGestionAutenticado;
var EmpleadoHelpdeskAutenticado = require("./routes/empleadoHelpdeskRouter").EmpleadoHelpdeskAutenticado;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//---------------------Middlewar msg-------------------------//
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 365 * 1000
  }
}));
app.use(flash());

 //---------------------Global-------------------------------//
 app.use((req, res, next) =>{
    res.locals.error_msg = req.flash('error_msg');
    res.locals.success_msg = req.flash('success_msg');
    next();
 });

//----------------------Rutas---------------------------------//
//app.use(console.log(ClienteAutenticado));
app.use('/', indexRouter);
app.use('/cliente',ClienteAutenticado, clienteRouter);
app.use('/empleadoGestion',EmpleadoGestionAutenticado, empleadoGestionRouter);
app.use('/empleadoHelpdesk',EmpleadoHelpdeskAutenticado, empleadoHelpdeskRouter);
app.use('/empleadoCalidad',EmpleadoCalidadAutenticado, empleadoCalidadRouter);
app.use('/empleado',EmpleadoComunAutenticado, empleadoComunRouter);

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
