//Index file

import keys from "../keys";

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = keys.mapbox;
var map;

map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-101.7076442768971, 39.74201539821678 ],
    zoom: 3.5
});

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

var yearSlider = document.getElementById("yearSlider");
var sliderPos = document.getElementById("sliderPos");

sliderPos.innerHTML = "All Years"; 

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

//  // Test function to log map center and zoom on zoom change 
// map.on("zoomend",function() {
//     console.log("zoom", map.getZoom()); 
//     console.log("center", map.getCenter())
// })

