var _ = require('lodash');
var twitter = require('./twitter');
var klout = require('./klout');

var celebPoints = {};
var config;

var init = function(data){
    config = data;

    twitter.init(config);
    klout.init(config);
    setInterval(calculatePoints, 1000);
};

var calculatePoints = function(){
    var celebMentions = twitter.celebMentions;
    var range = Date.now() - config.streaming.range;
    _.each(config.celebs, function(celeb){
        celebPoints[celeb] = {};

        celebPoints[celeb].twitter = 0;
        celebPoints[celeb].klout = klout.celebs[celeb];
        var mentions = celebMentions[celeb];
        _.each(mentions, function(mention){
            if (mention > range) ++celebPoints[celeb].twitter;
        });
    });
};

module.exports = {
    init: init,
    celebPoints: celebPoints
};
