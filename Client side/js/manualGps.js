///// Google Map
var map, MyLocationinfoWindow;
var Lat , Lng;

function initMap() {

    // Maps initialization options (default location, zoom, etc..)
    var options = {
        zoom: 6,
        // minZoom: 10,
        // maxZoom: 20,
        //disableDoubleClickZoom: true,
        center: {
            lat: 32.109333,
            lng: 34.855499
        }
    }

    
    // Map initialize with the options above
    map = new google.maps.Map(document.getElementById('map'), options);
    var gmarkers = [];
    

    google.maps.event.addListener(map, 'click', function(event) {
        //alert( 'Lat: ' + event.latLng.lat() + ' and Longitude is: ' + event.latLng.lng() );
        Lat = event.latLng.lat();
        Lng = event.latLng.lng();
        for(i=0; i<gmarkers.length; i++){
            gmarkers[i].setMap(null);
        }
        var marker = new google.maps.Marker({
            position: event.latLng,
            map: map
          });
          gmarkers.push(marker);
     });

    
}