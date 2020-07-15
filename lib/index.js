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

//Add the fire tiles
map.on('load', function () {
    map.addSource('fire-tiles', {
        type: 'vector',
        url: 'mapbox://stickmanbob.0fos1j90',
    });
    map.addLayer({
        'id': 'fire-data',
        'source': 'fire-tiles',
        "source-layer": "Fire_perimeters_20002018",
        "type": "fill",
        "paint": {
            "fill-color": "#e38885"
        },
        // filter: ['==', ['number', ['get', 'fireyear']], 2018]
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

// Change cursor when hovering on a fire
map.on('mouseenter', 'fire-data', function () {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back on mouse leave
map.on('mouseleave', 'fire-data', function () {
    map.getCanvas().style.cursor = '';
});

// Display a popup when a fire is clicked on
map.on("click", "fire-data", function(e){

    
    let name = e.features[0].properties.incidentna;
    let acres = Number.parseInt(e.features[0].properties.gisacres).toLocaleString();
    let agency = e.features[0].properties.agency;

    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<span> <strong>Incident Name:</strong> ${name} </span>
                    <span> <strong>Acres: </strong> ${acres} </span>
                    <span> <strong>Agency:</strong> ${agency} </span>`)
        .addTo(map);
})


 // Test function to log map center and zoom on zoom change 
map.on("zoomend",function() {
    console.log("zoom", map.getZoom()); 
    console.log("center", map.getCenter())
})

