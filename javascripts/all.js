//generic api call
var apiData; //buffer for api data
var call = function(method,params,func){
    var key = "LynN70s698"; //DONT USE MY KEY
    var url = "http://www.brooklynmuseum.org/opencollection/api/?method="+method+"&version=1&api_key="+key+"&format=json&results_limit=10"+params;
    //using Yahoo Query Language to grab json because API was returning json instead of jsonp object
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + url + '"') + '&format=json&callback=?';  
    $.ajax({
        type: "GET",
        dataType : "json",
        url: yql
    })
    .done(function (data) {
        //add response to buffer
        apiData = data.query.results.response.resultset.items;
        //callback function (if defined)
         if (typeof func == 'function') { 
             func.call(this); 
            }
    })
    .error(function(){
        console.log('something went wrong');
    });
};
//DOM elements
var results=$('#results');
var searchButton=$('#search');

//search query buffer
var query;

//Bunch of callbacks for when API calls are done
function searchCallback(){
    $('.search.loader').remove();
    //console.log(apiData);
    //console.log('searching');
    $.each(apiData, function(index) {
        var
        src = apiData[index].images._.uri;  
        results.append('<img class="result image" src="'+src+'">');

    });
    //fake functionality to add piece to My Collection
    $('.result.image').click(function(){
        $(this).detach();
        $('#collection').append(this);
    });

}
function populate(){
    //initial image populate
    var container = $('#collection');
    //remove loader
    container.find('.loader').remove();
    $.each(apiData, function(index) {
        var src = apiData[index].images._.uri;  
        container.append('<img class="image" src="'+src+'">');
    });
}
call("collection.search","&keyword=New+York+City",function(){populate();});

//click handlers
$('.piece').click(function(){
    $(this).detach();
    $('#collection').append(this);
});

searchButton.click(function(e){
    var
    query=$('#query').val().trim().replace(/\s/g, '+');
    console.log(query.length);
    e.preventDefault();
    results.empty();
    results.append('<div class="search loader"></div>');
    if (query.length>0) {
        call("collection.search","&keyword="+query+"",function(){
            searchCallback();
        });
    }

});
