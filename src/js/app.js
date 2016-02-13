
var map;
var bexleyMap = new google.maps.LatLng(51.5040,0.1261);
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: bexleyMap,
    zoom:15
  });
}       

initMap();


