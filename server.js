var express = require('express');
var config = require('./config.json');
var points = require ('./points');

var app = express();

app.get('/buzz', function(req, res){
    res.json({
        celebs: points.getCelebPoints(),
    });
});

app.get('/*', express.static(__dirname + '/static/'));

app.listen(1234);
console.log('Listening on port 1234');

points.init(config);
