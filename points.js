var _ = require('lodash');
var twitter = require('./twitter');

var celebPoints = {};
var config;

var init = function(data){
    config = data;
    twitter.init(config);
    setInterval(calculatePoints, 1000);
};

var calculatePoints = function(){
    var range = Date.now() - config.streaming.range;
    _.each(twitter.celebMentions, function(mentions, celeb){
        celebPoints[celeb] = 0;
        _.each(mentions, function(mention){
            if (mention > range) ++celebPoints[celeb];
        });
    });
};

module.exports = {
    init: init,
    celebPoints: celebPoints
};
