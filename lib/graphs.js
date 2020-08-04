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

let topAgencies = ["BLM", "USFS", "State Agency", "Local Agency", "NPS", "BIA"];

var svg = d3.select("svg");

var margin = 60;

var width = svg.attr("width") - margin;

var height = svg.attr("height") - 2*margin; 

function selectData(x,y){
    let ySelector;
    let xSelector;
    switch (y){
        case "numFires":
            ySelector = (v) => v.length;
            break;
        case "numAcres":
            ySelector = (v) => d3.sum(v.map(d => d.properties.gisacres));
            break;
    }

    switch(x){
        case "allYears":
            xSelector = d => d.properties.fireyear;
            break;
        case "agency":
            xSelector = d => d.properties.agency;
    }

    let graphData = d3.rollup(fireData,ySelector,xSelector);
    if(x === "agency"){
        graphData.forEach((v, k) => {
            if (!topAgencies.includes(k)) {
                graphData.delete(k);
            }
        })
    }
    return graphData;
}

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
        .attr('width', xScale.bandwidth());
    chart.selectAll('rect').attr('fill', "#de1606");
}

const button = document.getElementById("graphSubmit");
const ySelect = document.getElementById("ySelect");
const xSelect = document.getElementById("xSelect");

var xData = xSelect.value;
var yData = ySelect.value; 

ySelect.addEventListener("change", (e) => {
    yData = e.target.value;
})

xSelect.addEventListener("change", (e) => {
    xData = e.target.value;
})



button.addEventListener("click",()=> drawChart(
    selectData(xData,yData)), );

