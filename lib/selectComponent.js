

const mapButton = document.getElementById("selectMap");

mapButton.addEventListener("click", selectMap);

const map = document.getElementById("map-container");

function selectMap(){

    if(map.classList.contains("display")){
        map.classList.remove("display");
    } else{
        map.classList.add("display");
    }

}