var _ = require('lodash');
var twitter = require('./twitter');
var klout = require('./klout');

var config;
var celebPoints;
var now;

var init = function(data){
    config = data;

    twitter.init(config);
    klout.init(config);
    setInterval(calculatePoints, 1000);
};

var calculatePoints = function(){
    celebPoints = [];
    var celebMentions = twitter.celebMentions;
    now = Date.now();
    _.each(config.celebs, function(celeb){
        var points = {
            celeb: celeb,
            twitter: calculateTwitterPoints(celebMentions[celeb]),
            klout: klout.celebs[celeb] || 0,
            random: randomPoints()
        };
        points.total = calculateTotal(points);

        celebPoints.push(points);
    });
};

var calculateTwitterPoints = function(mentions){
    var points = 0;
    _.each(mentions, function(mention){
        var age = now - mention;
        if (age < 100000) points += Math.floor(100 - age / 1000);
    });
    return points;
};

var randomPoints = function(){
    return Math.floor(Math.random() * 101);
};

var calculateTotal = function(points){
    var total = points.twitter + points.klout + points.random;
    total = Math.floor(Math.min(total, 1000) / 10);
    return total;
};

var getCelebPoints = function(){
    return celebPoints;
};

module.exports = {
    init: init,
    getCelebPoints: getCelebPoints
};
