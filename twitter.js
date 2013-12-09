var _ = require('lodash');
var twitter = require('twitter');

var config;
var celebMentions = {};

var init = function(data){
    config = data;

    _.each(config.celebs, function(celeb){
        celebMentions[celeb] = [];
    });

    new twitter(config.twitter).stream('statuses/filter', {
        track: config.celebs.join(',')
    }, function(stream) {
        stream.on('data', function(data){
            onStreamData(data);
        });
    });
};

var logTweet = function(date, celeb){
    var hours = date.getHours();
    if (hours < 10) hours = '0' + hours;
    var minutes = date.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    var seconds = date.getSeconds();
    if (seconds < 10) seconds = '0' + seconds;
    date = hours + ':' + minutes + ':' + seconds;
    console.log(date + ' @'+celeb+' mentioned');
};

var onStreamData = function(data){
    for (var i = config.celebs.length - 1; i >= 0; i--) {
        var celeb = config.celebs[i];
        if (data.text.indexOf(celeb) !== -1) {
            var date = new Date(Date.parse(data.created_at.replace(/( +)/, ' UTC$1')));
            logTweet(date, celeb);

            celebMentions[celeb].push(+date);
        }
    }
};

module.exports = {
    init: init,
    celebMentions: celebMentions
};
