/* globals $, Hogan, google */

var $tableView = $('.table-view');
var $chartView = $('.chart-view');
var template;
var chart;
var chartTable;
var chartHistory = [];

var getBuzz = function(){
    $.ajax('/buzz')
    .done(function(data){
        if (! data || ! data.celebs) return;
        updateHistory(data.celebs);
        if (template) $tableView.html(template.render(data));
        if (chart) addChart(data.celebs);
        setTimeout(getBuzz, 1000);
    })
    .fail(function(){
        setTimeout(getBuzz, 1000);
    });
};

var loadTemplate = function(){
    $.ajax('/template.html')
    .done(function(data){
        template = Hogan.compile(data);
    });
};

var timeFormatNow = function(){
    var now = new Date(Date.now());
    var hours = now.getHours();
    if (hours < 10) hours = '0'+hours;
    var minutes = now.getMinutes();
    if (minutes < 10) minutes = '0'+minutes;
    var seconds = now.getSeconds();
    if (seconds < 10) seconds = '0'+seconds;
    return hours + ':' + minutes + ':' + seconds;
};

var updateHistory = function(data){
    var row = [timeFormatNow()];
    for (var i = 0, len = data.length; i < len; i++) {
        row.push(data[i].total);
    }
    if (chartHistory.length > 7200) chartHistory.shift();
    chartHistory.push(row);
};

var addChart = function(data){
    chartTable = new google.visualization.DataTable();

    chartTable.addColumn('string', 'Time');

    for (var i = 0, len = data.length; i < len; i++) {
        chartTable.addColumn('number', data[i].celeb);
    }

    chartTable.addRows(chartHistory);

    var options = {
        width: Math.min($(window).width(), 1200),
        height: 500,
        vAxis: {
            title: 'Buzz',
            minValue: 0,
            maxValue: 100
        },
        hAxis: {
            title: 'Time',
            slantedText: true
        },
        chartArea:{
            left: 50,
            top: 20,
            width:"80%",
            height:"80%"
        }
    };
    chart.draw(chartTable, options);
};

var initChart = function(){
    google.load('visualization', '1.0', {'packages':['corechart']});
    google.setOnLoadCallback(function(){
        chart = new google.visualization.LineChart($chartView[0]);
    });
};

var init = function(){
    loadTemplate();
    initChart();
    getBuzz();
};

init();
