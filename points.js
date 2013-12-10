var _ = require('lodash');
var twitter = require('./twitter');
var klout = require('./klout');

var config;
var celebPoints;

var init = function(data){
    config = data;

    twitter.init(config);
    klout.init(config);
    setInterval(calculatePoints, 1000);
};

var calculatePoints = function(){
    celebPoints = [];
    var celebMentions = twitter.celebMentions;
    var range = Date.now() - config.streaming.range;
    _.each(config.celebs, function(celeb){
        var item = {
            celeb: celeb,
            twitter: 0,
            klout: klout.celebs[celeb]
        };
        var mentions = celebMentions[celeb];
        _.each(mentions, function(mention){
            if (mention > range) ++item.twitter;
        });
        celebPoints.push(item);
    });
};

var getCelebPoints = function(){
    return celebPoints;
};

module.exports = {
    init: init,
    getCelebPoints: getCelebPoints
};
