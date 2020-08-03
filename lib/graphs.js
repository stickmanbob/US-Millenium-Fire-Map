// Animated interactive graph

// Import the fire data

var fireData = require("../assets/fire_data.json");

fireData = fireData.features;

const yearData = d3.rollup(fireData, v => v.length, d => d.properties.fireyear);

var svg = d3.select("svg");

var margin = 60;

var width = svg.attr("width") - margin;

var height = svg.attr("height") - 2*margin; 

function drawChart(map) {

    let data = [];

    map.forEach((v,k) => data.push({x:k, y:v}));

    //Draw the chart
    const chart = svg.append("g")
        .attr('transform',`translate(${margin},${margin})`);
    
    // Draw the Y axis
    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data.map(d=>d.y))]);
    
    
    chart.append('g')
        .call(d3.axisLeft(yScale));

    // Draw the X axis
    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d=>d.x).sort())
        .padding(0.2);

    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
    
    //Draw the bars
    chart.selectAll()
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (s) => xScale(s.x))
        .attr('y', (s) => yScale(s.y))
        .attr('height', (s) => height - yScale(s.y))
        .attr('width', xScale.bandwidth())
}

drawChart(yearData); 

