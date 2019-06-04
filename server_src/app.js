var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./../config');

var fragment = require('./routes/fragment');
var scenario = require('./routes/scenario');
var domainmodel = require('./routes/domainmodel');
var export_r = require('./routes/export');

var mongoose = require('mongoose');

var app = express();

// mongoose init
// MongoDB node.js driver deprecated some functions, thus the setting below
// (see https://mongoosejs.com/docs/deprecations)
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(config.MONGODB_HOST);

const maxBodySize = '50mb';

app.use(logger('dev'));
app.use(bodyParser.json({ limit: maxBodySize }));
app.use(bodyParser.urlencoded({ extended: false, limit: maxBodySize }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/fragment', fragment);
app.use('/api/scenario', scenario);
app.use('/api/domainmodel', domainmodel);
app.use('/api/export', export_r);

app.get('/api/version',function(req, res){
    res.json({
      'version': 1
    })
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.json(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.json(err);
});


module.exports = app;
