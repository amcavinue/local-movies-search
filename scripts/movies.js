'use strict';

// construct the url with parameter values
var apikey = "hptve64cy9g4cqudvw9vrnyv";
var baseUrl = "http://data.tmsapi.com/v1.1";
var showtimesUrl = baseUrl + '/movies/showings';
var zipCode = "44256";
var d = new Date();
var today = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();

$(document).ready(function() {
    $.ajax({
        url: showtimesUrl,
        data: {
                startDate: today,
                zip: zipCode,
                jsonp: "dataHandler",
                api_key: apikey
              },
        dataType: "jsonp",
    });
});

function dataHandler(data) {
    console.log(data);

    $(document.body).append('<p>Found ' + data.length + ' movies showing within 5 miles of ' + zipCode+':</p>');
    var movies = data.hits;

    $.each(data, function(index, movie) {
        var movieData = '',
            imageUrl = '';

        $.ajax({
            url: "http://www.omdbapi.com/",
            async: false,
            data: {
                t: movie.title
            }
        }).done(function(data) {
            imageUrl = data.Poster;
        });

        movieData = '<li class="tile">'+
            '<a href="#">'+
                '<img src="' + imageUrl + '"/>' +
                '<br/>' +
                movie.title +
            '</a>';

        if (movie.ratings) {
            movieData += ' (' + movie.ratings[0].code + ') </li>'
        } else {
            movieData += '</li>';
        }

        $('#movies-list').append(movieData);
    });
}