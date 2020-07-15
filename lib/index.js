//Index file

import keys from "../keys";

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = keys.mapbox;

var map;

// Init the map
map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-99.81800785622892, 38.583524031549416 ],
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
                'case',[
                    'boolean', ['feature-state','hover'],
                    false
                ],
                '#df4572',
                "#e38885"   
            ]
        },
    });
});

//Initialize the slider
var yearSlider = document.getElementById("yearSlider");
var sliderPos = document.getElementById("sliderPos");

sliderPos.innerHTML = "All Years"; 

// Filter fires when the slider is moved
// The leftmost position is for year "1999", which shows all fires (No actual data for 1999)
yearSlider.oninput = function() {
    if(this.value === "1999") {
        sliderPos.innerHTML = "All Years";
        map.setFilter('fire-data', null);
        console.log("set")
    } else{
        sliderPos.innerHTML = this.value; 
        map.setFilter('fire-data', ['==', ['number', ['get', 'fireyear']], Number.parseInt(this.value)]);
    }
    
}

// Change cursor and add hover effect when hovering on a fire
// selectedFireId keeps track of currently hovered fire so we can deselect later
var selectedFireId;

map.on('mouseenter', 'fire-data', function (e) {
    map.getCanvas().style.cursor = 'pointer';

    // Add hover effect to current feature
    selectedFireId = e.features[0].id;

    map.setFeatureState({
        source: 'fire-tiles',
        "sourceLayer": "Fire_perimeters_20002018",
        id: selectedFireId,
    }, {
        hover: true
    });
});

// Change both back on mouse leave
map.on('mouseleave', 'fire-data', function () {
    map.getCanvas().style.cursor = '';

    if(selectedFireId){
        map.setFeatureState({
            source: 'fire-tiles',
            "sourceLayer": "Fire_perimeters_20002018",
            id: selectedFireId,
        }, {
            hover: false 
        });
    }
});

// Display a popup when a fire is clicked on
map.on("click", "fire-data", function(e){

    
    let name = e.features[0].properties.incidentna;
    let acres = Number.parseInt(e.features[0].properties.gisacres).toLocaleString();
    let agency = e.features[0].properties.agency;
    let year = e.features[0].properties.fireyear;
    let fireid = e.features[0].properties.uniquefire;
    console.log (e.features[0]); 
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<span> <strong>Incident Name:</strong> ${name} </span>
                    <span> <strong>Fire ID:</strong> ${fireid} </span>
                    <span> <strong>Acres: </strong> ${acres} </span>
                    <span> <strong>Agency:</strong> ${agency} </span>
                    <span> <strong>Year:</strong> ${year} </span>`)
        .addTo(map);
})


 // Test function to log map center and zoom on zoom change 
map.on("zoomend",function() {
    console.log("zoom", map.getZoom()); 
    console.log("center", map.getCenter())
})

