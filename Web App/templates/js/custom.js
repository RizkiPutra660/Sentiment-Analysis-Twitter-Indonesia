var current_data;
function sentiment_to_color(sentiment){
    if(sentiment == 'positive') return 'panel-success';
    else if(sentiment == 'negative') return 'panel-danger';
    else return 'panel-primary';
}

function load_tweets(querystring){
    $.ajax({
        url: 'tweets',
        data: {'query': querystring, 'retweets_only': 'false', 'with_sentiment': 'true'},
        dataType: 'json',
        type: 'GET',
        success: function(data) {
            buildChart(data);
            current_data = data['data'];
            var tweets = data['data'];
            var container = $('#tweets');
            var contents = '';
            contents+='<div>'
            
            for(i = 0; i < tweets.length; i++){
                contents+= '<div class="rounded panel '+ sentiment_to_color(tweets[i].sentiment) +'"> <div class="panel-heading"> <h3 class="panel-title"><a target="_blank" href="http://twitter.com/'+ tweets[i].user +'">'+tweets[i].user+'</a></h3> </div> <div class="panel-body"><blockquote class="shadow p-3 mb-5 bg-white rounded">'+ tweets[i].text + '</blockquote> </div> </div>'
                //contents+= '<div class="panel '+ sentiment_to_color(tweets[i].sentiment) +'"> <div class="panel-heading"> <h3 class="panel-title">'+ tweets[i].user +'</h3> </div> <div class="panel-body"><blockquote>'+ tweets[i].text + '</blockquote> </div> </div>'
                // contents += '<li class="list-group-item '+ sentiment_to_color(tweets[i].sentiment) +'">'+ tweets[i].user + ": " + tweets[i].text + '</li>';
            }
            
            contents+='</div>';
            container.html(contents);
            $('#query').val(querystring);
            $('#loading').html(data['count'] + " Tweets loaded about "+ querystring +".");
        }
    });
}

function get_csv(json){
    var fields = Object.keys(json[0]);
    var csv = json.map(function(row){
        return fields.map(function(fieldName){
        return JSON.stringify(row[fieldName] || '');
        });
    });
    csv.unshift(fields);
    return csv.join('\r\n');
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

//$(document).ready(function(){
//load_tweets('Indonesia');
//});

$('#query').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        $('#loading').html('Loading...');
        $('#tweets').html('');
        load_tweets($('#query').val());
    }
});

$('#search').click(function(){
    $('#loading').html('Loading...');
    $('#tweets').html('');
    load_tweets($('#query').val());
});

$('#getcsv').click(function(){
    download('data.csv', get_csv(current_data));
});

function buildChart(data) {
    Highcharts.chart('container', {
        chart: {
            plotBackgroundColor: "#B0E0E6", 
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'last 100 tweets on '+$('#query').val()
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: getPercentage(data)
    });
};

function getNegativePercentage(data) {
    var current_data = data['data'];
    var counter = 0 ;
    for (var i = current_data.length - 1; i >= 0; i--) {
        if(current_data[i].sentiment == 'negative') 
            counter ++;
    }
    console.log('negative',counter)
    return counter/data.count;
}

function getPositivePercentage(data) {
    var current_data = data['data'];
    var counter = 0 ;
    for (var i = current_data.length - 1; i >= 0; i--) {
        if(current_data[i].sentiment == 'positive') 
            counter ++;
    }
        console.log('positive',counter)

    return counter/data.count;
}

function getNeutralPercentage(data) {
    var current_data = data['data'];
    var counter = 0 ;
    for (var i = current_data.length - 1; i >= 0; i--) {
        if(current_data[i].sentiment == 'neutral') 
            counter ++;
    }
    console.log('neutral',counter)
    return counter/data.count;
}

function getPercentage(data) {
    var neutral = getNeutralPercentage(data);
    var positive = getPositivePercentage(data);
    var negative = getNegativePercentage(data);

    return [{
        name: 'Tweets',
        //colorByPoint: true,
        data: [{
            name: 'Positive',
            y: positive
        }, {
            name: 'Negative',
            y: negative,
            sliced: true,
            selected: true
        }, {
            name: 'Neutral',
            y: neutral
        }]
    }]
    // body...
}