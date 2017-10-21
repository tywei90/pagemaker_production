var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var genpages = require('./routes/genpages');
var email = require('./routes/email');
var h5 = require('./routes/h5');
var released = require('./routes/released');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, '../build/image', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use('/build', express.static(path.join(__dirname, '../build')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/release', express.static(path.join(__dirname, '../release')));
app.use('/tmp', express.static(path.join(__dirname, '../tmp')));
app.use('/files', express.static(path.join(__dirname, '../files')));
app.use('/src', express.static(path.join(__dirname, '../src')));



app.use('/', index);
app.use('/genpages', genpages);
app.use('/users', users);
app.use('/email', email);
app.use('/h5', h5);
app.use('/released', released);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    err.title = 'Not Found';
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    // res.status(err.status || 500);
    res.render('error', {
        data: {
            title: '访问地址错误'
        },
        request: req,
        isLogin: true,
        retcode: 400,
        retdesc: '访问地址错误'
    });
});

module.exports = app;
