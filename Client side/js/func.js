// alert("CONNECTED!");

///// Global variables
var checkboxesNormal = document.getElementsByClassName("normalFilter");
var checkboxAll = document.getElementById("AllFiltersID");
var currentCheckedFilters = document.getElementsByClassName("custom-control-input");
var currentCheckedFiltersValues = [];
var radiusSearch = document.getElementById("radiusSliderInput");
var locationGranted = false;
var currUserCoords = [];

function selectOnOption() {
    // console.log("inside selectOnOption");
    var countCheckboxes = 0;
    for (var i = 0; i < checkboxesNormal.length; i++) {
        if (checkboxesNormal[i].checked == true)
            countCheckboxes++;
    }
    console.log(countCheckboxes);
    if (countCheckboxes == checkboxesNormal.length) {
        // console.log("inside if");
        countCheckboxes = 0;
        checkboxAll.checked = true;
    }
    else {
        // console.log("inside else");
        countCheckboxes = 0;
        checkboxAll.checked = false;
    }
    google.maps.event.trigger(map, 'idle');
    filtersChanged();
}

function filtersChanged() {
    // console.log("inside filtersChanged");
    currentCheckedFiltersValues = []; // empty array which will hold checked filters' values
    for (var i = 1; i < currentCheckedFilters.length; i++) {
        if (currentCheckedFilters[i].checked) {
            currentCheckedFiltersValues.push(currentCheckedFilters[i].value);
        }
    }
    console.log(currentCheckedFiltersValues);
    return currentCheckedFiltersValues;
}

// All filters are checked at first entrance to the website
toggleAllFiltersAtFirst();
function toggleAllFiltersAtFirst() {
    // console.log("inside toggleAllFiltersAtFirst");
    for (var i = 0; i < checkboxesNormal.length; i++) {
        checkboxesNormal[i].checked = true;
        currentCheckedFiltersValues.push(checkboxesNormal[i].value);
        checkboxAll.checked = true;
    }
}

function toggleAllFilters() {
    // console.log("inside toggleAllFilters");
    for (var i = 0; i < checkboxesNormal.length; i++) {
        if (checkboxesNormal[i] != checkboxAll)
            checkboxesNormal[i].checked = checkboxAll.checked;
    }
    google.maps.event.trigger(map, 'idle');
}

///// Checks if user has cookie/logged in or not
$(document).ready(function () {
    $.ajax({
        url: 'hasCookie',
        method: 'GET',
        contentType: false,
        processData: false,
        success: function (data) {
            var loginBtn = document.getElementById("loginButton");
            loginBtn.innerHTML = "<i class=\"fas fa-user-check\"></i> Logged in as " + data[1];
        },
        error: function (jqXHR, responseText, errorThrown, data) {
        }
    });
})

function findme() {

    ///// Find My Location button /////			

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '40px';
    firstChild.style.height = '40px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '11px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0 0';
    secondChild.style.backgroundRepeat = 'no-repeat';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'center_changed', function () {
        secondChild.style['background-position'] = '0 0';
    });

    ///// Clicking on the "find me" button triggers "findMeNow" function
    firstChild.addEventListener('click', findMeNow);

    ///// Find current device location at first entrance to the website
    findMeNow();

    ///// Find device location 
    function findMeNow() {
        var imgX = '0',
            animationInterval = setInterval(function () {
                imgX = imgX === '-18' ? '0' : '-18';
                secondChild.style['background-position'] = imgX + 'px 0';
            }, 500);

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            locationGranted = true;

            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                currUserCoords = pos;

                MyLocationinfoWindow.setPosition(pos);
                MyLocationinfoWindow.setContent('<div style="width:180px; text-align: right;">Your Approximate location.</div>');
                MyLocationinfoWindow.open(map);
                map.setCenter(pos);
                // map.setZoom(19);

                clearInterval(animationInterval);
                secondChild.style['background-position'] = '-144px 0';

                $("#radiusSlider").removeClass("disabled");
                $("#radiusSliderToggle").trigger("click");

            }, function () {
                clearInterval(animationInterval);
                handleLocationError(true);
            });
        } else { // Browser doesn't support Geolocation
            secondChild.style['background-position'] = '0 0';
            handleLocationError(false);
        }

        function handleLocationError(browserHasGeolocation) {
            browserHasGeolocation ? alert("Error: cannot determine your location.") :
                alert("Error: No geolocation service.");

        }
    }

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
} // findme function END

///// Google Map
var map, MyLocationinfoWindow;
var markersArray = [];
var markerCluster;
var oms; // Spiderfier for markers

function initMap() {

    // Maps initialization options (default location, zoom, etc..)
    var options = {
        zoom: 2,
        minZoom: 2,
        // maxZoom: 3,
        center: {
            lat: 32.109333,
            lng: 34.855499
        },
        scaleControl: true,
        zoomControl: true,
        rotateControl: true,
    }

    // Map initialization
    map = new google.maps.Map(document.getElementById('map'), options);
    MyLocationinfoWindow = new google.maps.InfoWindow; // User's approximate location Info Window

    oms = new OverlappingMarkerSpiderfier(map, {
        markersWontMove: true,   // we promise not to move any markers, allowing optimizations
        markersWontHide: true,   // we promise not to change visibility of any markers, allowing optimizations
        basicFormatEvents: true,  // allow the library to skip calculating advanced formatting information
        circleSpiralSwitchover: 10, // (default: 9)
        circleFootSeparation: 80, // (default: 23)
        circleStartAngle: 1, // (default: pi / 6)
        spiralFootSeparation: 100, // (default: 26)
        spiralLengthStart: 25, // (default: 11)
        spiralLengthFactor: 20, // (default: 4)
        legWeight: 3, // (default: 1.5)
        keepSpiderfied: true
    });

    markerCluster = new MarkerClusterer(map, markersArray, { imagePath: 'MarkerClusterImages/', gridSize: 50, averageCenter: true, maxZoom: 15 });

    // Calls findme() function to find current location and create 'find me' button
    findme();

    // // Search box include autocomplete by Google // //
    // // https://developers.google.com/maps/documentation/javascript/examples/places-searchbox // //

    // Create the search box and link it to the UI element.
    var input = document.getElementById('searchInputAutoComplete');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    // Idle map listener 
    map.addListener('idle', function () {
        // console.log("inside: idle");

        var mapBounds = map.getBounds();
        var ne = mapBounds.getNorthEast();
        var sw = mapBounds.getSouthWest();

        var center = map.getCenter();

        var radius = radiusSearch.value / 111; // kilometer converted to coordinates

        if (radius) { // User has provided radius
            if (locationGranted) { // Able to find location

                $.getJSON("http://localhost/webapplication1/api/numOfPhotos",
                    { neX: ne.lat(), neY: ne.lng(), swX: sw.lat(), swY: sw.lng(), rad: radius, centerX: currUserCoords.lat, centerY: currUserCoords.lng }, function (data) {
                        addMarkers(data);
                    });
                // })
            }

            else { // Can't find location
                radius = 0;
                $.getJSON("http://localhost/webapplication1/api/numOfPhotos",
                    { neX: ne.lat(), neY: ne.lng(), swX: sw.lat(), swY: sw.lng(), rad: radius, centerX: 0, centerY: 0 }, function (data) {
                        addMarkers(data);
                    });
            }
        }
        else { // User hasn't provided radius
            $.getJSON("http://localhost/webapplication1/api/numOfPhotos",
                { neX: ne.lat(), neY: ne.lng(), swX: sw.lat(), swY: sw.lng(), rad: radius, centerX: 0, centerY: 0 }, function (data) {
                    addMarkers(data);
                });
        }

        function addMarkers(data) {
            console.table(data);

            // delete all previous photo markers
            markersArray.forEach(function (photoMarker) {
                photoMarker.setMap(null);
            });

            markerCluster.clearMarkers();

            var imageURL = newFunction(); 
            for (var i = 0; i < data.length; i++) {

                if (currentCheckedFiltersValues.includes(data[i].filters)) {
                    imageURL = "http://localhost/webapplication1/api/image/" + data[i].id; //  PICTURE
                    imageThumbnailURL = "http://localhost/webapplication1/api/image/" + "thumbnail_" + data[i].id; // THUMBNAIL PICTURE

                    var newMarker = new google.maps.Marker({
                        position: {
                            lat: data[i].lat,
                            lng: data[i].lng,
                        },
                        title: "Filter: " + data[i].filters,
                        icon: {
                            url: imageThumbnailURL,
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(0, 50)
                        },
                        map: map,
                        markerId: data[i].id,
                    });

                    oms.addMarker(newMarker); // push every photo marker into the SpiderfierArray
                    markerCluster.addMarker(newMarker); // push every photo marker into the markersClusterArray

                    google.maps.event.addListener(newMarker, 'spider_click', function (event) {
                        console.log("inside someMarker Listener");
                        var selectedMarker = this;

                        console.log("selectedMarker url: " + selectedMarker.markerId);

                        $.getJSON("http://localhost/webapplication1/api/photodetails/" + selectedMarker.markerId, function (photoData) {
                            photoDetailsSet(photoData);
                        });

                        function photoDetailsSet(photoDataRow) {
                            var modalIMGURL = "http://localhost/webapplication1/api/image/" + selectedMarker.markerId;

                            var modalIMGdescription = document.getElementById("exampleModalLongTitle");
                            var modalIMGMarker = document.getElementById("modalIMG");
                            var modalIMGuploadDate = document.getElementById("uploadDateIMGspan");
                            var modalIMGuserName = document.getElementById("userNameIMGspan");

                            // function getUserGallery(usr) {alert("test");}
                            modalIMGMarker.setAttribute("src", modalIMGURL);
                            modalIMGdescription.innerHTML = photoDataRow[0].description;
                            modalIMGuploadDate.innerHTML = photoDataRow[0].uploaddate;
                            modalIMGuserName.innerHTML = '<a onClick="getUserGallery(' + photoDataRow[0].username + ');">' + photoDataRow[0].username + '</a>';
                        }

                        $('#exampleModalCenter').modal('show');

                    });
                };
            }
        }

    });


    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: 'Markers/Searched.svg',
                title: place.name,
                position: place.geometry.location,
                animation: google.maps.Animation.DROP
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

} // InitMap function END

function newFunction() {
    var imageURL;
    return imageURL;
}

///// Picture Upload

function pictureUploadbtn() {
    console.log("inside: pictureUpload");
    // Save the new user details
    var data = new FormData();

    var files = $('#my-file-selector').get(0).files;

    // Add the uploaded image content to the form data collection
    if (files.length > 0) {
        data.append("UploadedImage", files[0]);
    }

    $.ajax({
        url: 'Upload',
        method: 'POST',
        contentType: false,
        processData: false,
        data: data,
        success: function (data) {
            $.ajax({
                url: 'GPS',
                method: 'POST',
                contentType: false,
                processData: false,
                data: data,
                success: function (datain) {
                    alert(datain[0]);
                    window.location.href = 'photoDetails.html';
                },
                error: function (jqXHR, responseText, errorThrown) {
                    alert("no gps");
                    window.location.href = 'ManualGps.html';
                }
            });
        },
        error: function (jqXHR, responseText, errorThrown) {
            alert("Upload failed / Login to upload photos");
        }
    });
}
