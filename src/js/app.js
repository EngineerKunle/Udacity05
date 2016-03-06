//global variables
var map;
//list 5 locations
var locations = [
    {
        name: 'Asda',
        lat: 51.45889,
        lng: 0.13946
    },
    {
        name: 'National Trust: The Red House',
        lat: 51.45556,
        lng: 0.12954
    },
    {
        name: 'Broadway Shopping Centre',
        lat: 51.45612,
        lng: 0.14616
    },
    {
        name: 'Danson Park',
        lat: 51.45577,
        lng: 0.12258
    },
    {
        name: 'Bexley Train Station',
        lat: 51.46346,
        lng: 0.13381
    }
];

//this is to help if Maps failed to load.
function mapError(e) {
    alert("Google map failed to load");
}

//initialse our Map
function initMap() {

    var mapping = document.getElementById('map');
    var bexleyMap = {
        lat: 51.4589,
        lng: 0.1384
    };
    map = new google.maps.Map(mapping, {
        center: bexleyMap,
        zoom: 14
    });
}

//helped with marking each points specified
function placedMarker(place, lat, lng) {
    this.place = place;
    this.lat = lat;
    this.lng = lng;

    var marker = new google.maps.Marker({
        position: {
            lat: this.lat,
            lng: this.lng
        },
        title: name,
        map: map,
        animation: google.maps.Animation.DROP
    });

    return marker;
}

var MapViewModel = function () {
    initMap();
    //keep track of "this" in a variable
    var self = this;
    //arrays of loction placed in here
    self.markers = [];
    self.locationsArray = ko.observableArray(locations);

    //here is to clear the markers
    self.clearMarkers = function(){
      for (var i = 0; i < self.markers.length; i++) {
        // console.log();
        self.markers[i].setMap(null);
      }
      self.markers = [];
    };

    //with query result place new markers
    self.syncMarkers = function(locations){
        var locs = locations || self.locationsArray();
        locs.forEach(function(locs){
            var pin = new placedMarker(locs.name, locs.lat, locs.lng);
            self.markers.push(pin);
        });
    };


    //query search result
    self.search = ko.observable("");

    //update the list based on user input
    self.filterPins = ko.computed(function () {
        if (!self.search()) {
            return self.locationsArray();
        } else {

            var query = self.search().toLowerCase();
            var results = ko.utils.arrayFilter(self.locationsArray(), function (location) {

                var locationName = location.name.toLowerCase();
                return locationName.indexOf(query) > -1;

            });
            self.clearMarkers();
            self.syncMarkers(results);

            return results;
        }
    });
    //sync all markers to begin with
    self.syncMarkers();
};

var newModel;

function initApp() {
    newModel = new MapViewModel();
    ko.applyBindings(newModel);
}
