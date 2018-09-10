
var things = [];
if (typeof (Storage) !== "undefined") {
    document.getElementById("div1").innerHTML = localStorage.getItem("todos");
    if (localStorage.getItem("todos")) {
        things = JSON.parse(localStorage.getItem("todos"));
    }
} else {
    document.getElementById("div1").innerHTML = "Sorry, your browser does not support Web Storage...";
}


function addToList() {
    var text = document.getElementById("text1").value;
    things.push(text);
    document.getElementById("div1").innerHTML = things;
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("todos", JSON.stringify(things));
    } else {
        document.getElementById("div1").innerHTML = "Sorry, your browser does not support Web Storage...";
    }

}

