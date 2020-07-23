
import keys from "../keys";

// Import the fire data
var fireData = require("../assets/fire_data.json");

// Set the map and header to take up the whole page

let headerMap = document.getElementById("header-map");
headerMap.style.height = `${window.innerHeight}px`; 

// Import mapbox and the API key
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = keys.mapbox;


// Init the map variable
var map;
var tilesLoaded = false; 

// Array of all features and data
var fireData;

// Init the map
map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-99.81800785622892, 38.583524031549416],
    zoom: 3.9122929526635173
});

map.addControl(new mapboxgl.NavigationControl());

//Add the fire tiles
map.on('load', function () {
    map.addSource('fire-tiles', {
        type: 'vector',
        url: 'mapbox://stickmanbob.0fos1j90',
        "promoteId": "OBJECTID",
    });
    map.addLayer({
        'id': 'fire-data',
        'source': 'fire-tiles',
        "source-layer": "Fire_perimeters_20002018",
        "type": "fill",
        // "#e38885"
        "paint": {
            "fill-color": [
                'case', [
                    'boolean', ['feature-state', 'hover'],
                    false
                ],
                '#df4572',
                "#e38885"
            ],
            "fill-opacity": 0.5, 
        },
    });

    updateInfoBox(); 
});



//Initialize the slider
var yearSlider = document.getElementById("yearSlider");
var sliderPos = document.getElementById("sliderPos");

sliderPos.innerHTML = "All Years (2000-2018)";

// Filter fires when the slider is moved
// The leftmost position is for year "1999", which shows all fires (No actual data for 1999)
yearSlider.oninput = function () {
    if (this.value === "1999") {
        sliderPos.innerHTML = "All Years (2000-2018)";
        map.setFilter('fire-data', null);
        
        updateInfoBox();
    } else {
        sliderPos.innerHTML = this.value;
        map.setFilter('fire-data', ['==', ['number', ['get', 'fireyear']], Number.parseInt(this.value)]);
        updateInfoBox(Number.parseInt(this.value));
    }

}


// Change cursor and add hover effect when hovering on a fire
// selectedFireId keeps track of currently hovered fire so we can deselect later
var selectedFireId;

map.on('mouseenter', 'fire-data', function (e) {
    map.getCanvas().style.cursor = 'pointer';  
});

map.on('mousemove', 'fire-data', function(e){
    
    if (selectedFireId) {
        map.setFeatureState({
            source: "fire-tiles",
            sourceLayer: "Fire_perimeters_20002018",
            id: selectedFireId
        },{
            hover: false
        });
    }

    // Add hover effect to current feature
    selectedFireId = e.features[e.features.length - 1].id;

    map.setFeatureState({
        source: 'fire-tiles',
        "sourceLayer": "Fire_perimeters_20002018",
        id: selectedFireId,
    }, {
        hover: true
    });


})

// Change both back on mouse leave
map.on('mouseleave', 'fire-data', function () {
    map.getCanvas().style.cursor = '';

    if (selectedFireId) {
        map.setFeatureState({
            source: 'fire-tiles',
            "sourceLayer": "Fire_perimeters_20002018",
            id: selectedFireId,
        }, {
            hover: false
        });
    }

    selectedFireId = null; 
});

// Display a popup when a fire is clicked on
map.on("click", "fire-data", function (e) {


    let name = e.features[e.features.length-1].properties.incidentna;
    let acres = Number.parseInt(e.features[e.features.length - 1].properties.gisacres).toLocaleString();
    let agency = e.features[e.features.length - 1].properties.agency;
    let year = e.features[e.features.length - 1].properties.fireyear;
    let fireid = e.features[e.features.length - 1].properties.uniquefire;
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<span> <strong>Incident Name:</strong> ${name} </span>
                    <span> <strong>Fire ID:</strong> ${fireid} </span>
                    <span> <strong>Acres: </strong> ${acres} </span>
                    <span> <strong>Agency:</strong> ${agency} </span>
                    <span> <strong>Year:</strong> ${year} </span>`)
        .addTo(map);
})

// Update info box using fire data

function updateInfoBox(year = undefined) {
    
    let data;

    if (year === undefined){
        data = fireData.features;
    } else{
        data = fireData.features.filter(feature => feature.properties.fireyear === year);
    }

    let acres = 0;

    data.forEach(datum => acres += Number.parseInt(datum.properties.gisacres));

    let totalFires = data.length;

    let acresBox = document.getElementById("fire-area");

    let firesBox = document.getElementById("total-fires")

    acresBox.innerHTML = acres.toLocaleString();
    firesBox.innerHTML = totalFires; 
}

// Display the instructions panel when the help button is clicked

    let helpButton = document.getElementById("help-button");
    let instructions = document.getElementById("instructions");
    
    helpButton.addEventListener("click", ()=> {
        
        if(instructions.classList.contains("show")){
            instructions.classList.remove("show");
            helpButton.classList.replace("fa-times-circle", "fa-question");
        } else{
            instructions.classList.add("show");
            helpButton.classList.replace("fa-question", "fa-times-circle");
        }
    }); 

// // Test function to log map center and zoom on zoom change 
// map.on("zoomend", function () {
//     console.log("zoom", map.getZoom());
//     console.log("center", map.getCenter())
// })

//Collapse the sidebar


