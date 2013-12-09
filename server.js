var express = require('express');
var YAML = require('yamljs');
var twitter = require('twitter');
var _ = require('lodash');

var app = express();
var config = YAML.load(__dirname + '/config.yaml');
var celebs = config.celebs;
var twitterAPI = new twitter(config.twitter);

var pointsTempl = {};
_.each(config.celebs, function(celeb){
    pointsTempl[celeb] = 0;
});

var lastTwitterPoints = _.clone(pointsTempl);
var twitterPoints = _.clone(pointsTempl);
setInterval(function(){
    lastTwitterPoints = _.clone(twitterPoints);
    twitterPoints = _.clone(pointsTempl);
}, config.streaming.interval);

twitterAPI.stream('statuses/filter', {
    track: config.celebs.join(',')
}, function(stream) {
    stream.on('data', function(data){
        for (var i = celebs.length - 1; i >= 0; i--) {
            if (data.text.indexOf(celebs[i]) !== -1) {
                console.log('@'+celebs[i]+' mentioned');
                twitterPoints[celebs[i]]++;
            }
        }
    });
});

app.get('/buzz', function(req, res){
    res.json(lastTwitterPoints);
});

app.listen(1234);
console.log('Listening on port 1234');
