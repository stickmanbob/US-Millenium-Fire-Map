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
        url: 'mapbox://stickmanbob.0cueslda',
    });
    map.addLayer({
        'id': 'fire-data',
        'source': 'fire-tiles',
        "source-layer": "Historic_GeoMAC_Perimeters_Al-7h297a",
        "type": "fill",
        "paint": {
            "fill-color": "#e38885"
        }
    });
});

