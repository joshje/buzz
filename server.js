var express = require('express');
var config = require('./config.json');
var points = require ('./points');

var app = express();

app.get('/buzz', function(req, res){
    res.json(points.celebPoints);
});

app.listen(1234);
console.log('Listening on port 1234');

points.init(config);
