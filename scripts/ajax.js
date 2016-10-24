'use strict';

// Google maps geocoding service.
// https://developers.google.com/maps/documentation/javascript/geocoding
function getAreaCode(position) {
    var lat = position.coords.latitude,
        lng = position.coords.longitude,
        latlng = new google.maps.LatLng(lat, lng),
        geocoder = new google.maps.Geocoder();

    userLocation = {
        lat: lat,
        lng: lng
    };

    // Use the lattitude and longitude from the
    // browser to get the areacode from google.
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                for(var i=0; i<results[0].address_components.length; i++)
                {
                    if (results[0].address_components[i].types[0] === "postal_code") {
                        areaCode = results[0].address_components[i].short_name;
                        initMap();
                        getMovies();
                    }
                }
            }
        }
    });
}

// Get the local movies from the OnConnect API.
// http://developer.tmsapi.com/io-docs
function getMovies() {
    var d = new Date(),
        today = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();

    $.ajax({
        url: 'http://data.tmsapi.com/v1.1/movies/showings',
        data: {
            startDate: today,
            zip: areaCode,
            jsonp: "moviesHandler",
            radius: radius,
            api_key: "hptve64cy9g4cqudvw9vrnyv"
        },
        dataType: "jsonp"
    });
}

// Get images from the OMDB API.
// http://omdbapi.com/
function getImage(title) {
    var imageUrl;

    $.ajax({
        url: "http://www.omdbapi.com/",
        async: false,
        data: {
            t: title
        }
    }).done(function(data) {
        imageUrl = data.Poster;
    });

    return imageUrl;
}

// Google maps API.
// Gets the latlng object from an address or zip code.
function codeAddress(address) {
    var location;

    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json",
        async: false,
        data: {
            address: address,
            key: apiKeyGm
        }
    }).done(function(data) {
        location = data.results[0].geometry.location;
    }).fail(function() {
        console.log('failed');
    });

    return location;
}

// Google maps API.
// Gets the addresses for movie theatres from Google.
function textSearch(query, id) {
    var service;

    var request = {
        location: userLocation,
        query: query
    };

    service = new google.maps.places.PlacesService(map);
    // Only look for theatres we haven't gotten yet.
    if (!theatres[id]) {
        service.textSearch(request, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    // Store the latlng object under the theatre id.
                    theatres[id] = codeAddress(results[i].formatted_address);
                }
            }
        });
    }
}