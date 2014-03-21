
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var person = require('./routes/person');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pcheck');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) {
  res.send('API is running');
});
db.once('open', function callback () {
    console.log('connected to db');
    app.get('/api/person', person.get);
    app.post('/api/person', person.post);
    app.delete('/api/person/:id', person.delete);
}.bind(this));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


