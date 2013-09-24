
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/index');
var charts = require('./routes/charts');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

//CROSS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.configure(function() {
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(allowCrossDomain);
app.use(app.router);
//app.use(require('stylus').middleware(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, '../../src/main/webapp')));
app.use(express.static(path.join(__dirname, '../../docs/_site')));
//});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//url mappings
//app.get('/', routes.index);
app.get('/users', user.list);
//charts callbacks
app.get('/charts/:type', charts.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
