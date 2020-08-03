// Animated interactive graph

// Import the fire data

var fireData = require("../assets/fire_data.json");

fireData = fireData.features;

var svg = d3.select("svg");

var margin = 200;

var width = svg.attr("width") - margin;

var height = svg.attr("height") - margin; 

var xScale = d3.scaleBand().range([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);

var chart = svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");



    xScale.domain(fireData.map(function (d) { 
        return d.properties.fireyear; }).sort());
    yScale.domain([0, d3.count(fireData, d => d.properties.fireyear)]);

    chart.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    chart.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function (d) {
            return d;
        }).ticks(10))
        .append("text")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("value");

