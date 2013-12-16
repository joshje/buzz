var _ = require('lodash');
var twitter = require('./twitter');
var klout = require('./klout');

var config;
var celebPoints;
var maxPoints = 0;
var now;

var init = function(data){
    config = data;

    twitter.init(config);
    klout.init(config);
    setInterval(calculatePoints, 1000);
};

var calculatePoints = function(){
    var celebMentions = twitter.celebMentions;
    now = Date.now();
    celebPoints = _.map(config.celebs, function(celeb, i){
        var lastTotal = celebPoints && celebPoints[i] && celebPoints[i].total;
        var points = {
            celeb: celeb.name,
            twitter: calculateTwitterPoints(celebMentions[celeb.twitter]),
            klout: klout.celebs[celeb.twitter] || 0,
            random: randomPoints(),
            lastTotal: lastTotal
        };
        points.total = calculateTotal(points);

        return points;
    });
    normaliseTotals();
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
    total = Math.floor(total / 10);
    return total;
};

var getCelebPoints = function(){
    return celebPoints;
};

var normaliseTotals = function(){
    var normTotal = config.normalise.total;
    var variance = config.normalise.variance;

    var newMax = _.max(celebPoints, 'total').total;
    if (newMax > maxPoints) {
        maxPoints = newMax;
    } else {
        maxPoints = (maxPoints + newMax) / 2;
    }
    _.each(celebPoints, function(celeb){
        var total;
        var normal = celeb.total / maxPoints;
        total = Math.pow(normal, variance) * normTotal;
        if (celeb.lastTotal) {
            total = (total + celeb.lastTotal * 2) / 3;
            delete celeb.lastTotal;
        }
        celeb.total = Math.floor(total);
    });
};

module.exports = {
    init: init,
    getCelebPoints: getCelebPoints
};
