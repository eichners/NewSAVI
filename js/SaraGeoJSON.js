// This script demonstrates some simple things one can do with leaflet.js
//test line

var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

// add these tiles to our map
map.addLayer(CartoDBTiles);


// create global variables we can use for layer controls
var subwayLinesGeoJSON;
var neighborhoodsGeoJSON;
var floodZonesGeoJSON; 
var wifispotsGeoJSON;

/*
// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
// let's add the subway lines
$.getJSON( "geoJSON/MTA_subway_lines.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var subwayLines = data;

    // style for subway lines
    var subwayStyle = {
        "color": "#a5a5a5",
        "weight": 2,
        "opacity": 0.80
    };

    // function that binds popup data to subway lines
    var subwayClick = function (feature, layer) {
        console.log(layer);
        // let's bind some feature properties to a pop up
        layer.bindPopup(feature.properties.Line);
    }

    // using L.geojson add subway lines to map
    subwayLinesGeoJSON = L.geoJson(subwayLines, {
        style: subwayStyle,
        onEachFeature: subwayClick
    }).addTo(map);

});

*/

// add flood zone data
$.getJSON( "geoJSON/HurricaneEvacuationZones.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var floodZones = data;

//CHORLOPLETH 
//this is a loop
    // flood zone choropleth map
    var floodStyle = function (feature){

        var value = feature.properties.hurricane_;
        var fillColor = null;
        }
        if(value == 1){
            fillColor = "#034e7b";
        }
        if(value == 2){
            fillColor = "#0570b0";
        }
        if(value == 3){
            fillColor = "#3690c0";
        }
        if(value == 4){
            fillColor = "#74a9cf";
        }
        if(value == 5) { 
            fillColor = "#a6bddb";
        }
        if(value == 6) { 
            fillColor = "#d0d1e6";
        }
         if(value == 7) { 
            console.log ("Hello");
            fillColor = "#000000";
            //f1eef6
        }
         if(value === "X") { 
            console.log ("hello!")
            fillColor = "#000";
            //#7CBF2F
        }
// this var style = is for all the other styled aspects of each zone polygon
        var style = {
            weight: 2,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.8,
            fillColor: fillColor
        };
// return --this is needed for 
        return style;
    }

    var zoneClick = function (feature, layer) {
        //percent created with * 100
        var zone = feature.properties.hurricane_;
        // toFixed(0) cuts out everything after 0, toFixed(1) will print one decimal
        // let's bind some feature properties to a pop up
        layer.bindPopup("<stront>Hurricane Evacuation Zone: </strong>" + feature.properties.hurricane_);
    }
//This is a loop below: We've used one for each layer
//for layer switcher
    HurricaneEvacuationZonesGeoJSON = L.geoJson(floodZones, {
        style: floodStyle,
        onEachFeature: zoneClick
    }).addTo(map);
});


// add wifi data
$.getJSON( "geoJSON/NYCWi-FiHotspots.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var wifispots = data;
        // wifispots dots
    var wifispotsPointToLayer = function (feature, latlng){
        var wifispotsMarker = L.circle(latlng, 100, {
            stroke: false,
            fillColor: '#2ca25f',
            fillOpacity: 1
        });
        
        return wifispotsMarker;  
    }

    var wifispotsClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Name:</strong> " + feature.properties.BUSINESS_N + "<br /><strong>Address:</strong> " + feature.properties.ADDRESS);
    }

    wifispotsGeoJSON = L.geoJson(wifispots, {
        pointToLayer: wifispotsPointToLayer,
        onEachFeature: wifispotsClick
    }).addTo(map);
});

/*
// let's add neighborhood data
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var neighborhoods = data;
//CHORLOPLETH 
//this is a loop
    // neighborhood choropleth map
    // let's use % in poverty to color the neighborhood map
    var povertyStyle = function (feature){

        var value = feature.properties.PovertyPer;
        var fillColor = null;
        if(value >= 0 && value <=0.1){
            fillColor = "#fee5d9";
        }
        if(value >0.1 && value <=0.15){
            fillColor = "#fcbba1";
        }
        if(value >0.15 && value<=0.2){
            fillColor = "#fc9272";
        }
        if(value > 0.2 && value <=0.3){
            fillColor = "#fb6a4a";
        }
        if(value > 0.3 && value <=0.4) { 
            fillColor = "#de2d26";
        }
        if(value > 0.4) { 
            fillColor = "#a50f15";
        }
        
// this var style = is for all the other styles of each neighborhood
        var style = {
            weight: 1,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.75,
            fillColor: fillColor
        };
// return --this is needed for 
        return style;
    }

    var povertyClick = function (feature, layer) {
        //percent created with * 100
        var percent = feature.properties.PovertyPer * 100;
        // toFixed(0) cuts out everything after 0, toFixed(1) will print one decimal
        percent = percent.toFixed(0);
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Percent in Poverty: </strong>" + percent + "%");
    }
//This is a loop below: We've used one for each layer
    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        style: povertyStyle,
        onEachFeature: povertyClick
    }).addTo(map);


    // create layer controls
    createLayerControls(); 

});


function createLayerControls(){

    // add in layer controls
    var baseMaps = {
        "CartoDB": CartoDBTiles,
    };

    var overlayMaps = {
        "Pawn Shops": pawnShopsGeoJSON,
        "Subway Lines": subwayLinesGeoJSON,
        "Povery Map": neighborhoodsGeoJSON
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);

}

*/




