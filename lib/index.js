//Index file

import keys from "../keys";

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = keys.mapbox;

document.addEventListener("DOMContentLoaded",()=>{
    
    
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11'
    });
})
