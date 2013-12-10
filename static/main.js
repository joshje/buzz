/* globals $, Hogan */

var $body = $('body');
var template;

var getBuzz = function(){
    $.ajax('/buzz')
    .done(function(data){
        $body.html(template.render(data));
        setTimeout(getBuzz, 1000);
    });
};

$.ajax('/template.html')
.done(function(data){
    template = Hogan.compile(data);
    getBuzz();
});
