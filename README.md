 
 
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

