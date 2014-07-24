

'use strict';

var app = angular.module('crimespaceAngularApp');

app.controller('MainCtrl', function ($scope, $http, $filter){
    $http.get('/api/getCrimeData').success(function(crimeData){
        $scope.crimeMarkers = crimeData;
    });

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

    $scope.mapControl = {};

    $scope.$watch('details', function(details) {
        $scope.map.center = {
            latitude: details.geometry.location.lat(),
            longitude: details.geometry.location.lng()
        };
        $scope.map.zoom = 16;
    });

     var circle ={
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: .9,
        scale: 6,
        strokeColor: 'black',
        strokeWeight: 1,
    };

    var infoWindow = new google.maps.InfoWindow({});

    $scope.$watch('mapControl', function(mapControl){
        var map = $scope.mapControl.getGMap();

        $http.get('/api/getCrimeData').success(function(crimeData){
            var markers =  _.map(crimeData, function(element){
                var myLatlng = new google.maps.LatLng(element.latitude, element.longitude);

                var marker = new google.maps.Marker({
                    position: myLatlng,
                    title: element.type,
                    icon: circle
                });

                var infoContent = '<div style="width: 135px; height: 50px; font-size: 12px; font-family: Courier; color: black"><b>' + element.type + '<br>' + 'MONTH: ' + element.month + '<br>' + 'YEAR: ' + element.year +'<b></div>';

                bindInfoWindow(marker, map, infoWindow, infoContent);
                return marker;
            });

            var markerCluster = new MarkerClusterer(map, markers, {
                maxZoom: 16
            });
        }); // $http callback

        function bindInfoWindow(marker, map, infoWindow, infoContent){
            google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent(infoContent);
                infoWindow.open(map, marker);
            });
        }
    }); // $scope.$watch('mapControl', )

//--------------------------------------------------
//  EARLIER TRY: FILTERING MARKERS [DIDN'T WORK]
//--------------------------------------------------

    // $scope.showMarker = function(crimeType){
    //     for (var i = 0; i < markers.length; i++){
    //         if(markers[i].title === crimeType){
    //             markers[i].setVisible(true);
    //         }
    //     }
    //     document.getElementById(crimeType.toLowerCase().replace(/ /g, '') + "-" + "box").checked = true;
    // };

    // $scope.hideMarker = function(crimeType){
    //     for (var i = 0; i < markers.length; i++) {
    //         if(markers[i].title === crimeType){
    //             markers[i].setVisible(false);
    //         }
    //     }
    //     document.getElementById(crimeType.toLowerCase().replace(/ /g, '') + "-" + "box").checked = false;
    //     infoWindow.close();
    // };

    // $scope.checkBoxClicked = function(box, crimeType){
    //     if(box.checked){
    //         showMarker(crimeType);
    //     } else{
    //         hideMarker(crimeType);
    //     }
    // };

    // $scope.generateMap = function(){

    // };
    // $scope.murderFilter = function(){
    //     $http
    // };

}); // End of MainCtrl's scope ...

//--------------------------------------------------
// FILTER FUNCTIONS:

// #1: Filtering for Murders:

// app.filter("murderFilter", function($http){
//         // var map = $scope.mapControl.getGMap();
//         $http.get('/api/getCrimeData').success(function(crimeData){
//         return function(){
//                 var murderMarkers =  _.map(crimeData, function(element){
//                     if(element.type === "MURDER"){
//                         var myLatlng = new google.maps.LatLng(element.latitude, element.longitude);

//                         var marker = new google.maps.Marker({
//                             position: myLatlng,
//                             title: element.type,
//                             icon: circle
//                         });

//                         //---------------------------------------------
//                         // INFO WINDOWS:
//                         var infoContent = '<div style="width: 135px; height: 50px; font-size: 12px; font-family: Courier; color: black"><b>' + element.type + '<br>' + 'MONTH: ' + element.month + '<br>' + 'YEAR: ' + element.year +'<b></div>';

//                         //---------------------------------------------
//                         return marker;
//                     }
//                 });
//                     // var markerCluster = new MarkerClusterer(map, murderMarkers, {
//                     //     maxZoom: 16
//                     // });
//             };
//     });
// });




