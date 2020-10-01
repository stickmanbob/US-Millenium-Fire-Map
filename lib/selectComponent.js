// Bind event handlers to the nav buttons to select which data
// component we want to show

// Get the elements
const mapButton = document.getElementById("selectMap");

const graphButton = document.getElementById("selectGraph");

// Add event listeners
mapButton.addEventListener("click", selectMap);

graphButton.addEventListener('click', selectGraph);


// Get data components
const map = document.getElementById("map-container");

const graphs = document.getElementById("graphs");

// Create handlers to add the class "display" to 
// whichever data component we want to show

function selectMap(){

    if(graphs.classList.contains("display")){

        graphs.classList.remove("display");

        map.classList.add("display");
    }

}


function selectGraph(){
    
    if (map.classList.contains("display")) {

        map.classList.remove("display");
        graphs.classList.add("display");
    }

}