var map;
var marker;
var markerPoint = function(name, lng, lat, wikiid, webUrl) {
    this.name = name;
    this.lng = lng;
    this.lat = lat;
    this.wikiID = wikiid;
    this.webUrl = webUrl;
    this.marker = marker;
};
var viewModel = {
    resorts: [
        new markerPoint("Winter Park Resort", 39.886927, -105.761325, "Winter_Park_Resort", "https://www.winterparkresort.com"),
        new markerPoint("Snowshoe Mountain Resort", 38.410553, -79.993699, "Snowshoe_Mountain", "https://www.snowshoemtn.com"),
        new markerPoint("Stratton Mountain Resort", 43.114917, -72.906929, "Stratton_Mountain_Resort", "https://www.stratton.com"),
        new markerPoint("Blue Mountain Resort", 44.504930, -80.309992, "Blue_Mountain_(ski_resort)", "https://www.bluemountain.ca"),
        new markerPoint("Tremblant Resort", 46.210167, -74.584993, "Mont_Tremblant_Resort", "https://www.tremblant.ca"),
        new markerPoint("Steamboat Resort", 40.45669502741314, -106.80609941482544, "Steamboat_Ski_Resort", "https://www.steamboat.com"),
        new markerPoint("Mammoth Mountain Resort", 37.630626, -119.032626, "Mammoth_Mountain", "https://www.mammothmountain.com/")
    ],
    //observable used for running filter against resorts array
    filtered: ko.observable(''),
};
//console.log(viewModel);
// open infowindow upon click of list
this.activeMapMarker = function(name) {
    google.maps.event.trigger(this.marker, 'click');
};
//Filtering for text input
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
//load google map
function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: new google.maps.LatLng(38.941834, -89.532451),
            mapTypeId: google.maps.MapTypeId.ROAD,
        });
        //custom map markers
        var iconMtn = {
            url: '/img/icon_mtn.png',
            size: new google.maps.Size(32, 22),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 22)
        };
        var infowindow = new google.maps.InfoWindow({});
        for (var i = 0; i < viewModel.resorts.length; i++) {
            var self = viewModel.resorts[i];
            viewModel.resorts[i].marker = new google.maps.Marker({
                position: new google.maps.LatLng(self.lng, self.lat),
                map: map,
                animation: google.maps.Animation.DROP,
                icon: iconMtn,
                name: self.name,
                wikiID: self.wikiID,
                webUrl: self.webUrl,
            });
            // Opens and bounces an infowindow for a marker when clicked upon.
            openInfoWindow = function(marker) {
                map.setCenter(marker.getPosition());
                map.setZoom(13);
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 700);
                infowindow.setContent(marker.name);
                infowindow.open(map, marker);
                var wikiSourceUrl = 'https://en.wikipedia.org/wiki/' + marker.wikiID;
                //console.log(wikiSource);
                wikiUrl = 'http://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&exchars=150&titles=' + marker.wikiID + '&format=json&callback=wikiCallback';
                //wiki JSONP call referenced fro classwork
                $.ajax({
                    url: wikiUrl,
                    dataType: 'jsonp',
                }).done(function(data) {
                    //console.log(data);
                    var excerpt = data.query.pages[Object.keys(data.query.pages)[0]].extract;
                    infowindow.setContent('<div><a href=' + marker.webUrl + '><h4>' + marker.name + '</h4></a><p id="wikiExcerpt">' + excerpt + '</p><a href=' + wikiSourceUrl + '>more</a><br><br>Source: ' + '<a href=' + wikiSourceUrl + '>Wikipedia</a>, the free encyclopedia.' + '</div>');
                }).fail(function(jqXHR, textStatus) {
                    alert("Failed to load Wikpedia Content");
                });
            };
            // Open infowindow upon click
            this.addListener = google.maps.event.addListener(self.marker, 'click', function() {
                openInfoWindow(this);
            });
        }
        //reset list and map bounds
        this.resetMarkers = function(reset) {
            this.filtered('');
            infowindow.close();
            map.fitBounds(bounds);
        };
        //Map bounds object
        var bounds = new google.maps.LatLngBounds();
        //Loop through an array of points, add them to bounds
        for (i = 0; i < viewModel.resorts.length; i++) {
            self = viewModel.resorts[i];
            var geoCode = new google.maps.LatLng(self.lng, self.lat);
            bounds.extend(geoCode);
        }
        //Add new bounds object to map
        map.fitBounds(bounds);
        ko.applyBindings(viewModel);
    }
    // Show alert when Google Maps request fails 
function googleError() {
    alert("It appears that Google Map's failed not load. Please check your internet connectiona and try again.");
}