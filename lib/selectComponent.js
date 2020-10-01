

const mapButton = document.getElementById("selectMap");

const graphButton = document.getElementById("selectGraph");

mapButton.addEventListener("click", selectMap);
graphButton.addEventListener('click', selectGraph);

const map = document.getElementById("map-container");

const graphs = document.getElementById("graphs");


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