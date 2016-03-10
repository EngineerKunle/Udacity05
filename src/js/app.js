//global variables
var map;


//list 5 locations
var locations = [
    {
        name: 'Asda',
        lat: 51.45889,
        lng: 0.13946,
        description: "Asda - Place to shop"
    },
    {
        name: 'National Trust: The Red House',
        lat: 51.45556,
        lng: 0.12954,
        description: "The Red House - The Red House"
    },
    {
        name: 'Broadway Shopping Centre',
        lat: 51.45612,
        lng: 0.14616,
        description: "Broadway Shopping Centre - Bexley Shopping mall"
    },
    {
        name: 'Danson Park',
        lat: 51.45577,
        lng: 0.12258,
        description: "Danson Park - Have fun in the park"
    },
    {
        name: 'Bexley Train Station',
        lat: 51.46346,
        lng: 0.13381,
        description: "Bexley Train Station - Off to a new city"
    }
];

//this is to help if Maps failed to load.
function mapError(e) {
    alert("Google map failed to load");
};

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
};

//foursquare details
var foursquare = function (data, callback) {
    //foursqaure
    var clientId = "O2MRPCSYIDAFMNVONXF5YSNVB3N3FYCY4DISAIQHA4BKLTAO";
    var clientSecret = "XBRXY4EZI1CPPX5ZG3OS3FHQWJQBYWIHKCIMIKPIOVMKX4RM";
    var foursquareUrl = "https://api.foursquare.com/v2/venues/search?ll=51.45889,0.13946&query=" + data.place + "&client_id=" + clientId + '&client_secret=' + clientSecret + "&v=20160309";
    //    console.log(foursquareUrl);
    //    console.log(data.place);

    $.ajax({
        url: foursquareUrl,
        dataType: 'json',
        data: "",
        success: function (data) {
            callback(null, data);
        },
        error: function (e) {
            //here we are handling errors incase foursquare fails
            callback(e);
            alert("failed to load foursquare");
        }
    });

};

//helped with marking each points specified
function placedMarker(place, lat, lng, description) {
    var self = this;
    self.place = place;
    self.lat = lat;
    self.lng = lng;
    self.description = description;

    var marker = new google.maps.Marker({
        position: {
            lat: self.lat,
            lng: self.lng
        },
        title: name,
        map: map,
        animation: google.maps.Animation.DROP
    });

    self.infoWindow = new google.maps.InfoWindow({
        content: self.description
    });

    foursquare(self, function (e, data) {

        if (e) {
            alert("foursquare failed");
        } else {
            //console.log(data.response.venues[0].location.postalCode, " success");
            self.postCode = data.response.venues[0].location.postalCode;
            self.infoWindow.setContent(self.description + '<br">' + '<p style="text-align:center"> Foursquare says this is the postcode ' + self.postCode + " </p>");
        }
    });



    self.animateMarker = function () {
        //when users click on the marker display relevant info
        marker.addListener('click', function () {
            self.infoWindow.open(map, marker);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 2000);
        });
    }


    self.animateMarker();
    return {
        marker: marker,
        infoWindow: self.infoWindow
    };
}

//View models to handle our data
var MapViewModel = function () {
    initMap();
    //keep track of "this" in a variable
    var self = this;
    //arrays of loction placed in here
    self.markers = [];
    self.locationsArray = ko.observableArray(locations);

    //here is to clear the markers
    self.clearMarkers = function () {
        for (var i = 0; i < self.markers.length; i++) {
            // console.log();
            self.markers[i].marker.setMap(null);
        }
        self.markers = [];
    };

    //with query result place new markers
    self.syncMarkers = function (locations) {
        var locs = locations || self.locationsArray();
        locs.forEach(function (locs) {
            var pin = new placedMarker(locs.name, locs.lat, locs.lng, locs.description);
            self.markers.push(pin);
            // console.log(pin);
        });
    };



    self.listInfo = function (index) {
        //console.log(index);
        var bounce = self.markers[index].marker;
            bounce.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                bounce.setAnimation(null);
            }, 2000);
        //console.log(bounce);
        //bounce.animateMarker();
        var infoWindow = self.markers[index].infoWindow;
        infoWindow.open(map, self.markers[index].marker);
        
    }


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

//initilises the app once google maps has finished loads
function initApp() {
    newModel = new MapViewModel();
    //foursquare();
    ko.applyBindings(newModel);
}