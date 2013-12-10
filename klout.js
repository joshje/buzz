var _ = require('lodash');
var Klout = require("node_klout");

var klout;
var config;
var celebs = {};

var init = function(data){
    config = data;
    klout = new Klout(config.klout.api_key, "json", "v2");

     _.each(config.celebs, function(celeb, index){
        setTimeout(function(){
            getKloutScore(celeb.twitter);
        }, index * 500);
    });
};

var getKloutScore = function(celeb){
    klout.getKloutIdentity(celeb, function(error, data) {
        if (! data.id) return;
        klout.getUserScore(data.id, function(error, data) {
            if (! data.score) return;

            celebs[celeb] = Math.round(data.score);
        });
    });
};

module.exports = {
    init: init,
    celebs: celebs
};
