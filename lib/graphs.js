// Animated interactive graph

// Import the fire data
var fireData = require("../assets/fire_data.json");

fireData = fireData.features;

// Remove duplicate agencies from dataset
fireData.forEach((feature) => {

    switch (feature.properties.agency){
        case "State agency":
            feature.properties.agency = "State Agency";
        case "Local agency":
            feature.properties.agency = "Local Agency";
        case "C&L":
            feature.properties.agency = "Local Agency";
        case "CDF":
            feature.properties.agency = "State Agency";
    }
    
})

const yearData = d3.rollup(fireData, v => v.length, d => d.properties.fireyear);

const acreData = d3.rollup(fireData, v => d3.sum(v.map(d => d.properties.gisacres)), d=> d.properties.fireyear);

const agencyData = d3.rollup(fireData, v => v.length, d=> d.properties.agency);

agencyData.forEach((v,k) => {
    if (v < 100){
        agencyData.delete(k);
    }
})


var svg = d3.select("svg");

var margin = 60;

var width = svg.attr("width") - margin;

var height = svg.attr("height") - 2*margin; 

function drawChart(map) {
    d3.selectAll("svg > *").remove();

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

var chartData = yearData;

const button = document.getElementById("graphSubmit");
const chartSelect = document.getElementById("chartSelect");

chartSelect.addEventListener("change", (e) => {
    console.log(e.target.value);
    switch (e.target.value){
        case "acres":
            chartData = acreData;
            break;
        case "num":
            chartData = yearData;
            break;
        case "agency":
            chartData = agencyData;
            break;
    } 
})




button.addEventListener("click",()=> drawChart(chartData), );

