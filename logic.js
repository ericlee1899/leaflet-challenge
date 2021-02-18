// grayscale
var grayback = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

// satellite
var satback = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

// outdoors
var outback = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

// map variable
var map = L.map("map", {
  center: [40, -95],
  zoom: 5,
  layers: [grayback, satback, outback]
});

// added grayscale to map
grayback.addTo(map);

// earthquakes
var eq = new L.LayerGroup();

// base layers
var base = {
  Satellite: satback,
  Grayscale: grayback,
  Outdoors: outback
};

// overlays 
var overlay = {
  "Earthquakes": eq
};

// controlling layers
L
  .control
  .layers(base, overlay)
  .addTo(map);

// pulling from website
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

// style function
  function styleInfo(feat) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feat.properties.mag),
      color: "#000000",
      radius: getRadius(feat.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // different colours represents different magnitudes
  function getColor(mag) {
    switch (true) {
      case mag > 5:
        return "#ea2c2c";
      case mag > 4:
        return "#ea822c";
      case mag > 3:
        return "#ee9c00";
      case mag > 2:
        return "#eecc00";
      case mag > 1:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }

  // earthquake radius
  function getRadius(mag) {
    if (mag === 0) {
      return 1;
    }
    return mag * 3;
  }

  // GeoJSON
  L.geoJson(data, {
    pointToLayer: function(feat, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feat, layer) {
      layer.bindPopup("Magnitude: " + feat.properties.mag + "<br>Location: " + feat.properties.place);
    }
  }).addTo(eq);
  eq.addTo(map);

  // creating legend with position
  var legend = L.control({
    position: "bottomright"
  });

  // legend details
  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // adding the legend to map
  legend.addTo(map);
});