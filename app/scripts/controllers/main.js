

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
    $scope.$watch('mapControl', function(mapControl){
        var map = $scope.mapControl.getGMap();

        $http.get('/api/getCrimeData').success(function(crimeData)
        {
            crimeData.forEach(function(element)
            {
                var myLatlng = new google.maps.LatLng(element.latitude, element.longitude);
                var marker = new google.maps.Marker({

                    position: myLatlng,
                    map: map,
                    title: element.type
                });
            });

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
            //     markers.push(markers);
            // });

            // //
            // var mc = new MarkerClusterer(map, markers, mc);
        });
    });

  });







