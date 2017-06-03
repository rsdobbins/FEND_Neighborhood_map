
var activeInfoWindow;
var toggleBounce;
var map;
var marker; 
var setVisbile;

function point(name, lat, long, foursquareID) {
    this.name = name;
    this.lat = ko.observable(lat);
    this.long = ko.observable(long);
    this.foursquareID  = ko.observable(foursquareID);


var infoWindow = new google.maps.InfoWindow({
          content: this.name
        });
var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        animation: google.maps.Animation.DROP,
        title: name,
        map: map,
    });

    
marker.addListener('click', function() {
activeInfoWindow&&activeInfoWindow.close();
infoWindow.open(map, marker);
activeInfoWindow = infoWindow;
toggleBounce(this);
    });

// open infowindow upon click of list
this.activeMapMarker = function(point) {
activeInfoWindow&&activeInfoWindow.close();
infoWindow.open(map, marker);
activeInfoWindow = infoWindow;

};
}


var toggleBounce = function(marker)  {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout (function () {
            marker.setAnimation(null)
            }, 2000);
        }
    }; 

var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: new google.maps.LatLng(39.386, -97.915),
    mapTypeId: google.maps.MapTypeId.TERRAIN
});

var viewModel = {
    points: ko.observableArray(
        [
        new point('Winter Park Resort', 39.886927, -105.761325, '4b3397c5f964a5202f1b25e3'),
        new point('Snowshoe Mountain Resort', 38.410553, -79.993699, '4b5c5a4cf964a520182c29e3'),
        new point('Stratton Mountain Resort', 43.114917,  -72.906929, '4b2d94ccf964a52030d924e3'),
        new point('Blue Mountain Resort', 44.504930, -80.309992, '4b6c4574f964a520f22c2ce3'),
        new point('Tremblant Resort', 46.210167, -74.584993, '4bd043089854d13a2055f74d'),
        new point('Steamboat Resort', 40.45669502741314, -106.80609941482544, '4b7712e7f964a520967a2ee3')
        ]
        ),
        filter: ko.observable(""),
};

//Filtering.
viewModel.filteredResorts = ko.dependentObservable(function() {
    var filter = this.filter().toLowerCase();
    if(!filter) {
        return this.points();
    } else {
        return ko.utils.arrayFilter(this.points(), function(item) {
            if(item.name.toLowerCase().search(filter) != -1) {
                return true;
            } 
        });
    }
}, 

viewModel);



ko.applyBindings(viewModel);
