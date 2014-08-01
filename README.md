 
 
#Crimen
New York City's Crime Map

##Crimes are clustered:
<img src="http://i.imgur.com/o0Ze7xb.png">
```javascript
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
});
```

##Search for crimes by address, with autocomplete feature:
<img src="http://i.imgur.com/34fdKKX.png">
```javascript
$scope.$watch('details', function(details) {
    $scope.map.center = {
        latitude: details.geometry.location.lat(),
        longitude: details.geometry.location.lng()
    };
    $scope.map.zoom = 16;
});
```

##View historical crime data in the form of dynamic charts:
<img src="http://i.imgur.com/XU55QIR.png">
```javascript
$scope.showIntro = true;
var chartExists = false;
$scope.generateChart = function(crimeType){
    // $('.crime-introduction').remove();
    $scope.showIntro = false;
    if(chartExists === true){
        $('#crime-highcharts').highcharts().destroy();
    }
    $('#crime-highcharts').highcharts({
        chart: {
            type: 'column',
        },
        colors: ['#AA0036'],
        title: {
            text: chartObject[crimeType]['title']
        },
        xAxis: {
            categories: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013']
        },
        yAxis: {
            title: {
                text: chartObject[crimeType]['name']
            }
        },
        series: [{
            name: chartObject[crimeType]['name'],
            data: chartObject[crimeType]['data']
        }]
    });
    chartExists === true;
};
```
