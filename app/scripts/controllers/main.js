

'use strict';

var app = angular.module('crimespaceAngularApp');

app.controller('MainCtrl', function ($scope, $http, $filter){
    $http.get('/api/getCrimeData').success(function(crimeData){
        console.log(crimeData.length);
        $scope.crimeMarkers = crimeData;
        // $scope.$apply();
    });
    // Add map object to the $scope:
    $scope.map = {
            center: {
                latitude: 40.7127,
                longitude: -74.0059
            },
            zoom: 10,
            options: {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}]
            }
        };

    // SETTING UP MARKERS THE OLD SCHOOL WAY:


    // This empty object is for the "control" attribute of the google-maps angular directive which will allow us to obtain the direct reference to the google map instance being used by the directive:
    $scope.mapControl = {};

    // var str_title = element.type + ' ' + element.month + ', ' + element.year;

//--------------------------------------------------
    // Connect ngAutoComplete output to viewable map area:
    $scope.$watch('details', function(details) {
        // console.log(details);
        // debugger;
        $scope.map.center = {
            latitude: details.geometry.location.lat(),
            longitude: details.geometry.location.lng()
        };
        $scope.map.zoom = 16;
    });
//--------------------------------------------------

    // '$watch' registers a listener callback to be called whenever the watchExpression changes:
    $scope.$watch('mapControl', function(mapControl){
        var map = $scope.mapControl.getGMap();

        $http.get('/api/getCrimeData').success(function(crimeData){
            var markers =  _.map(crimeData, function(element){
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

                google.maps.event.addListener(marker, 'click', function(){
                    infowindow.open(map, marker);
                });

                //---------------------------------------------
                return marker;
            });

            // Need to add options to the following cluster constructor:
            var mc = new MarkerClusterer(map, markers, {
                maxZoom: 16
            });
        });
    });
});

// app.filter('murderFilter', function(crimeArray){
//     crimeArray.
// });

// USE A DIRECTIVE TO DISPLAY SPECIFIC CRIMES:
// app.directive('murder', function(){
//     return function(scope, element, attrs){
//         element.bind('click', function(){
//             scope.crimeData
//         });
//     };
// });


