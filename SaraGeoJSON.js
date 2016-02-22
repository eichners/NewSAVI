/* This is my homework from a couple of weeks ago, long overdue. 
I used all these layers to see how they work together. In the future, I'd work to normalize population data in qgis or 
in a data software like office libre. The json file I have for neighborhoods didn't have a clear option for 
people per square mile so I just used the Pop number for this map. 
The layering is confusing and it seems maps with too many layers with data bound to pop up covers can be 
unwieldy. I'm interested in finding better ways to work with this.

at the bottom of this file I tried to add a legend with no luck. I'll try again on the next assignment. 

*/

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

/*
adding basemaps:
var OSMMapnikTiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution: 'Map Data and Tiles &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors'
});

....

var baseMaps = {
    "CartoDB": CartoDBTiles,
    "OSM Mapnik": OSMMapnikTiles
};
*/

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
            "weight": 3,
            "opacity": 0.50
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
                fillColor = "#003366";
    
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
        var fillOpacity = .5;
        if(value >= 0 && value <=50000){
            fillColor = "#f7f7f7";
        }
        if(value > 50001 && value <=100000){
            fillColor = "#cccccc";
        }
        if(value > 100001 && value<=150000){
            fillColor = "#969696";
        }
        if(value > 150001 && value <=200000){
            fillColor = "#636363";
        }
        if(value > 200001 && value <=300000) { 
            fillColor = "#252525";
        }


        
        
// this var style = is for all the other styles of each neighborhood
        var style = {
            weight: 1,
            opacity: 0.3,
            color: "#454545",
            fillOpacity: fillOpacity,
            fillColor: fillColor
        };
// return --this tells computer to display style
        return style;
    }

    var populationClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood: </strong> " + feature.properties.NYC_NEIG + "<br /><strong>Population: </strong>" + feature.properties.Pop);
    }
//This is a loop below: We've used one for each layer
    neighborhoodDataGeoJSON = L.geoJson(neighborhoodData, {
        style: populationStyle,
        onEachFeature: populationClick
    });

     // now lets add the data to the map in the order that we want it to appear
 
       // neighborhoods: 
        neighborhoodDataGeoJSON.addTo(map);

        // flood zones first
        floodZonesGeoJSON.addTo(map);

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

/* I'd like to create a legend, but I don't understand what the variables other than div are (Grades, Amounts or Labels) refer to
where are they defined? How do they relate back to the population value? 
- How does this legend get tied to the neighborhood map layer rather than flood zones? 

This is getting close below, but I dont' know how to define colors? If I understand the 
initial variables better, maybe I cna set tie the legend back to the fill colors in 
neighborhood layer better. should it be Pop? Neighborhoods

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) { 
    var div = L.DomUtil.create('div', 'legend'),
        amounts = [0, 50000, 100000, 150000, 200000, 2500000],
        labels = [];

        // for (var i = 0; <amounts.length; i ++) {
        //     div.innerHTML += '<p><strong>Amounts</strong></p>';
        for (var i = 0; i <= amounts.length; i++) {
        div.innerHTML += '<i style="background:' + fillColor(amounts[i] + 1) + '"></i> ' + amounts[i] + (amounts[i + 1] ? '&ndash;' + amounts[i + 1] + '<br />' : '+ <br />');
        }


    return div;
};

legend.addTo(map);
        

*/ 
//        



/*
var subwayLinesGeoJSON;
//var neighborhoodsGeoJSON;
var floodZonesGeoJSON; 
var wifispotsGeoJSON;
*/

