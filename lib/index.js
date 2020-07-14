//Index file

import keys from "../keys";

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = keys.mapbox;
var map;

map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-122.447303, 37.753574],
    zoom: 6
});

map.on('load', function () {
    map.addSource('fire-tiles', {
        type: 'vector',
        url: 'mapbox://stickmanbob.abjj02xe',
    });
    map.addLayer({
        'id': 'fire-data',
        'source': 'fire-tiles',
        "source-layer": "FirePerimeters-2000-2018-4m870d",
        "type": "fill",
        "paint": {
            "fill-color": "#e38885"
        },
        filter: ['==', ['number', ['get', 'fireyear']], 2018]
    });
});

var yearSlider = document.getElementById("yearSlider");
var sliderPos = document.getElementById("sliderPos");
sliderPos.innerHTML = yearSlider.value; 
yearSlider.oninput = function() {
    sliderPos.innerHTML = this.value;
    map.setFilter('fire-data', ['==', ['number', ['get', 'fireyear']], Number.parseInt(this.value)]);
} 

