// This script demonstrates some simple things one can do with leaflet.js


var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

// add these tiles to our map
map.addLayer(CartoDBTiles);

// add other basemaps:
// add in OSM Mapnik tiles
var OSMMapnikTiles = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',{
  attribution: 'Map Data and Tiles &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors'
});
// do not add to the map just yet, but add varible to the layer switcher control 

// add in MapQuest Open Aerial layer
var MapQuestAerialTiles = L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png',{
  attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
});


// create global variables we can use for layer controls
var subwayLinesGeoJSON;
var neighborhoodDataGeoJSON;
var floodZonesGeoJSON; 
var wifiSpotsGeoJSON;

addSubwayLines();

// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
// let's add the subway lines
function addSubwayLines() {
    $.getJSON( "geoJSON/MTA_subway_lines.geojson", function( data ) {
        // ensure jQuery has pulled all data out of the geojson file
        var subwayLines = data;

        // style for subway lines
        var subwayStyle = {
            "color": "#8c8c8c",
            "weight": 2,
            "opacity": 0.80
        };

        // function that binds popup data to subway lines
        var subwayClick = function (feature, layer) {
            // let's bind some feature properties to a pop up
            layer.bindPopup(feature.properties.Line);
        }

        // using L.geojson add subway lines to map
        subwayLinesGeoJSON = L.geoJson(subwayLines, {
            style: subwayStyle,
            onEachFeature: subwayClick
        });

          addfloodZones();
    });

}

function addfloodZones() {
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
            var fillOpacity = 0.8;
            
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
            if(value == 6){ 
                fillColor = "#d0d1e6";
            }
             if(value == 7){ 
                fillColor = "#000000";
            }
             if(value === "X"){ 
                fillColor = "#000",
                fillOpacity = 0;
            }
    // this var style = is for all the other styled aspects of each zone polygon
            var style = {
                weight: 1,
                opacity: 0.8,
                color: 'white',
                fillOpacity: fillOpacity,
                fillColor: fillColor
            };
    // return --this is needed to make function show up on screen 
            return style;
        }

        var zoneClick = function (feature, layer) {
            var zone = feature.properties.hurricane_;
            // toFixed(0) cuts out everything after 0, toFixed(1) will print one decimal
            // let's bind some feature properties to a pop up
            layer.bindPopup("<stront>Hurricane Evacuation Zone: </strong>" + feature.properties.hurricane_);
        }

    //for layer switcher
        floodZonesGeoJSON = L.geoJson(floodZones, {
            style: floodStyle,
            onEachFeature: zoneClick
        });

            addwifiSpots();
        });

    }


function addwifiSpots() {
$.getJSON( "geoJSON/NYCWi-FiHotspots.geojson", function( data ) {
    var wifiSpots = data;
    
    var wifiSpotPointToLayer = function (feature, latlng){
        var wifiSpotMarker = L.circle(latlng, 100, {
            stroke: false,
            fillColor: '#2ca25f',
            fillOpacity: .7
        });
        
        return wifiSpotMarker;  
    }

    var wifiSpotsClick = function (feature, layer) {
        layer.bindPopup(feature.properties.location + ", " + feature.properties.provider);
    }
//below pointToLayer is  a leaflet specific function or variable
    wifiSpotsGeoJSON = L.geoJson(wifiSpots, {
        pointToLayer: wifiSpotPointToLayer,
        onEachFeature: wifiSpotsClick
    });

    addNeighborhoodData();
  });
}

// let's add neighborhood data and show population density
function addNeighborhoodData() {
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var neighborhoodData = data;
//CHORLOPLETH 
//this is a loop
    // neighborhood choropleth map
    // let's use % in poverty to color the neighborhood map
    var populationStyle = function (feature){

        var value = feature.properties.Pop;
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
            fillOpacity: 0.2,
            fillColor: fillColor
        };
// return --this tells computer to display style
        return style;
    }

    var populationClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Population</strong>" + feature.properties.Pop);
    }
//This is a loop below: We've used one for each layer
    neighborhoodDataGeoJSON = L.geoJson(neighborhoodData, {
        style: populationStyle,
        onEachFeature: populationClick
    });

     // now lets add the data to the map in the order that we want it to appear
        // flood zones first
        floodZonesGeoJSON.addTo(map);

        // neighborhoods: leave this off for now
       neighborhoodDataGeoJSON.addTo(map);

        // subway lines next
        subwayLinesGeoJSON.addTo(map);

        // the wifi spots last
        wifiSpotsGeoJSON.addTo(map);


        // now create the layer controls!
        createLayerControls(); 

    });
}


function createLayerControls(){

    // add in layer controls
    var baseMaps = {
        "CartoDB": CartoDBTiles,
        "OSM Mapnik": OSMMapnikTiles,
        "Mapquest Aerial": MapQuestAerialTiles
    };

    var overlayMaps = {
       "Neighborhood Population": neighborhoodDataGeoJSON,
        "Hurricane Evacuation Zones": floodZonesGeoJSON,
        "Subway Lines": subwayLinesGeoJSON,
        "Wifi Spots": wifiSpotsGeoJSON
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);

}



/*
var subwayLinesGeoJSON;
//var neighborhoodsGeoJSON;
var floodZonesGeoJSON; 
var wifispotsGeoJSON;
*/

