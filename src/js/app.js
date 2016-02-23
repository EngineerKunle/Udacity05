var MapViewModel = function() {
    //var self = this;
    var map;
    var bexleyMap = new google.maps.LatLng(51.4589, 0.1384);

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: bexleyMap,
            zoom: 15
        });
    };

    initMap();
};

ko.applyBindings(MapViewModel());