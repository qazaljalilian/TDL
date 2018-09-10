
var things = [];

function addToList() {
    var text = document.getElementById("text1").value;
    things.push(text);
    document.getElementById("div1").innerHTML = things;
}
