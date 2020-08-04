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

var marginTop = 30;
var marginLeft = 80;
var margin = 70;

var width = svg.attr("width") - marginLeft;

var height = svg.attr("height") - (margin+marginTop); 

function selectData(x,y){
    let ySelector;
    let xSelector;
    switch (y){
        case "Fires":
            ySelector = (v) => v.length;
            break;
        case "Acres":
            ySelector = (v) => d3.sum(v.map(d => d.properties.gisacres));
            break;
    }

    switch(x){
        case "Year":
            xSelector = d => d.properties.fireyear;
            break;
        case "Agency":
            xSelector = d => d.properties.agency;
    }

    let graphData = d3.rollup(fireData,ySelector,xSelector);
    if(x === "Agency"){
        graphData.forEach((v, k) => {
            if (!topAgencies.includes(k)) {
                graphData.delete(k);
            }
        })
    }
    return graphData;
}

function drawChart(xLabel,yLabel) {
    let map = selectData(xLabel, yLabel);
    d3.selectAll("svg > *").remove();

    let data = [];

    map.forEach((v,k) => data.push({x:k, y:v}));

    //Draw the chart
    const chart = svg.append("g")
        .attr('transform',`translate(${marginLeft},${marginTop})`);
    
    // Draw the Y axis
    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data.map(d=>d.y))]);
    
    
    chart.append('g')
        .call(d3.axisLeft(yScale).tickFormat(d3.format(".2s")));

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

    // Add Labels
    svg.append('text')
        .attr('x', -(height / 2) - marginTop)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yLabel)
        .attr('class', "axis-label");
    
    svg.append('text')
        .attr('y', height + margin + marginTop - 15)
        .attr('x', width/2 + 50)
        .attr('text-anchor', 'middle')
        .text(xLabel)
        .attr('class',"axis-label");

    // // Top Label
    // svg.append('text')
    //     .attr('x', width / 2 + margin)
    //     .attr('y', 40)
    //     .attr('text-anchor', 'middle')
    //     .text('Most loved programming languages in 2018')
}

const button = document.getElementById("graphSubmit");
const ySelect = document.getElementById("ySelect");
const xSelect = document.getElementById("xSelect");

var xData = xSelect.value;
var yData = ySelect.value; 

drawChart(xData,yData); 

ySelect.addEventListener("change", (e) => {
    yData = e.target.value;
})

xSelect.addEventListener("change", (e) => {
    xData = e.target.value;
})



button.addEventListener("click",()=> drawChart(xData, yData));

