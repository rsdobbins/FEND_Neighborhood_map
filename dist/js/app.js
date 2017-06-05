var activeInfoWindow;
var toggleBounce;
var map;
var marker;
var setVisbile;
var infowindow;
var map;
var openInfowindow;
var lastSelected;
var bounds;

var point = function(name, lng, lat, foursquareID, marker) {
    var self = this;
    this.name = name;
    this.lng = lng;
    this.lat = lat;
    this.foursquareID = foursquareID;
    this.marker = marker;

};


var viewModel = {
    resorts: [
        new point('Winter Park Resort', 39.886927, -105.761325, '4b3397c5f964a5202f1b25e3'),
        new point('Snowshoe Mountain Resort', 38.410553, -79.993699, '4b5c5a4cf964a520182c29e3'),
        new point('Stratton Mountain Resort', 43.114917, -72.906929, '4b2d94ccf964a52030d924e3'),
        new point('Blue Mountain Resort', 44.504930, -80.309992, '4b6c4574f964a520f22c2ce3'),
        new point('Tremblant Resort', 46.210167, -74.584993, '4bd043089854d13a2055f74d'),
        new point('Steamboat Resort', 40.45669502741314, -106.80609941482544, '4b7712e7f964a520967a2ee3')
    ],

    //observable used for running filter against resorts array
    filtered: ko.observable(''),

};
// open infowindow upon click of list
this.activeMapMarker = function(name) {
    google.maps.event.trigger(this.marker, 'click');
    };

//Filtering.
viewModel.filteredResorts = ko.computed(function() {
    var self = this;
    var searchResult = this.filtered().toLowerCase();
    var searchCompare = ko.utils.compareArrays(self.resorts, self.filteredResorts);

    return ko.utils.arrayFilter(self.resorts, function(markerLocation) {
        var name = markerLocation.name.toLowerCase();
        var matched = name.indexOf(searchResult) >= 0;
        var marker = markerLocation.marker;
        if (marker) {
            marker.setVisible(matched);
        }
        return matched;
    });
}, viewModel);


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: new google.maps.LatLng(38.941834, -89.532451),
        mapTypeId: google.maps.MapTypeId.ROAD,
    });
    var infowindow = new google.maps.InfoWindow({});
    for (var i = 0; i < viewModel.resorts.length; i++) {
        var self = viewModel.resorts[i];

        viewModel.resorts[i].marker = new google.maps.Marker({
            position: new google.maps.LatLng(self.lng, self.lat),
            map: map,
            name: self.name,
        });


        // Opens and bounces an infowindow for a marker when clicked upon.
        openInfoWindow = function(marker) {

            map.setCenter(marker.getPosition());
            map.setZoom(13);

            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 2000);

            infowindow.setContent(marker.name);
            infowindow.open(map, marker);
        };

        // Event listener opens infowindow upon being clicked.
        this.addListener = google.maps.event.addListener(self.marker, 'click', function() {
            openInfoWindow(this);
        });
    }
//Create new bounds object
 var bounds = new google.maps.LatLngBounds();
 //Loop through an array of points, add them to bounds
 for (var i = 0; i < viewModel.resorts.length; i++) {
     var self = viewModel.resorts[i];
      var geoCode = new google.maps.LatLng(self.lng, self.lat);
      bounds.extend(geoCode); 
  }
  //Add new bounds object to map
  map.fitBounds(bounds);

    ko.applyBindings(viewModel);
    
    $("#reset_state").click(function() {
      infowindow.close();
      map.fitBounds(bounds);
    });
}
