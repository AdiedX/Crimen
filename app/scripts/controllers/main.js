

'use strict';

angular.module('crimespaceAngularApp')
  .controller('MainCtrl', function ($scope, $http)
  {
    $http.get('/api/getCrimeData').success(function(crimeData)
    {
        console.log(crimeData.length);
        $scope.crimeMarkers = crimeData;
        // $scope.$apply();
    });
    $scope.map = {
            center: {
                latitude: 40.7127,
                longitude: -74.0059
            },
            zoom: 8,
            options: {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}]
            }
        };

    // SETTING UP MARKERS THE OLD SCHOOL WAY:
    // Pass into Angular Google Maps:
    $scope.mapControl = {};
    // var str_title = element.type + ' ' + element.month + ', ' + element.year;

    $scope.$watch('details', function(details) {
        console.log(details);
        // debugger;
        $scope.map.center = {
            latitude: details.geometry.location.lat(),
            longitude: details.geometry.location.lng()
        };
        $scope.map.zoom = 14;
    });
    $scope.$watch('mapControl', function(mapControl){
        var map = $scope.mapControl.getGMap();

        $http.get('/api/getCrimeData').success(function(crimeData)
        {
            // JUST GENERATES THE MARKERS:
            // crimeData.forEach(function(element)
            // {
            //     var myLatlng = new google.maps.LatLng(element.latitude, element.longitude);
            //     var marker = new google.maps.Marker({

            //         position: myLatlng,
            //         map: map,
            //         title: element.type
            //     });
            // });

            var markers =  _.map(crimeData, function(element)
            {
                var myLatlng = new google.maps.LatLng(element.latitude, element.longitude);






                var marker = new google.maps.Marker({
                    position: myLatlng,
                    title: element.type
                });

                //---------------------------------------------
                // INFO WINDOWS:

                var infowindow = new google.maps.InfoWindow({
                    content: '<div style="width: 135px; height: 50px; font-size: 12px; font-family: Courier; color: black"><b>' + element.type + '<br>' + 'MONTH: ' + element.month + '<br>' + 'YEAR: ' + element.year +'<b></div>'
                });

                google.maps.event.addListener(marker, 'click', function()
                {
                    infowindow.open(map, marker);
                });

                //---------------------------------------------
                return marker;
            });

            // Need to add options to the following cluster constructor:
            var mc = new MarkerClusterer(map, markers);

            // CLUSTERING ALGORITHM:
            // var markers = [];
            // for (var i = 0; i < 100; i++)
            // {
            //     var latLng = new google.maps.LatLng(data.photos[i].latitude, data.photos[i].longitude);
            //     var marker = new google.maps.Marker({'position': latLng});
            //     markers.push(marker);
            // }
            // var markerCluster = new MarkerClusterer(map, markers);



            // // We specify a number of option to fine-tune the marker manager's performance:
            // var mcOptions = {gridSize: 50, maxZoom: 15};

            // // This is where a specific set of markers to be clustered go in:
            // var markers = [];

            // // For each instance of crime in the database:
            // crimeData.forEach(function(crime)
            // {
            //     // Why this is wrong:
            //     // I need to push markers from a specific geographic area
            //     // This methods currently selects markers in order
            //     markers.push(markers.crime);
            // });

            // //
            // var mc = new MarkerClusterer(map, markers, mc);
        });
    });

  });


// // This function was written by Val Schuman of http://valschuman.blogspot.com/
// function toCamelCase(s) {
//     // remove all characters that should not be in a variable name
//     // as well underscores an numbers from the beginning of the string
//     s = s.replace(/([^a-zA-Z0-9_\- ])|^[_0-9]+/g, "").trim().toLowerCase();
//     // uppercase letters preceeded by a hyphen or a space
//     s = s.replace(/([ -]+)([a-zA-Z0-9])/g, function(a,b,c) {
//         return c.toUpperCase();
//     });
//     // uppercase letters following numbers
//     s = s.replace(/([0-9]+)([a-zA-Z])/g, function(a,b,c) {
//         return b + c.toUpperCase();
//     });
//     return s;
// }​





