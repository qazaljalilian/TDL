
var things = [];
if (typeof (Storage) !== "undefined") {
    document.getElementById("div1").innerHTML = localStorage.getItem("todos");
    if (localStorage.getItem("todos")) {
        things = JSON.parse(localStorage.getItem("todos"));
    }
} else {
    document.getElementById("div1").innerHTML = "Sorry, your browser does not support Web Storage...";
}
function fetchList(){
var xhr = new XMLHttpRequest();
xhr.open("GET","http://localhost:3000/todos", true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        var result = json.todos.map(a => a.text)
        document.getElementById("div1").innerHTML=result ;
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem("todos", JSON.stringify(result));
        } else {
            document.getElementById("div1").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
    }
};
xhr.send();

}




function addToList() {
    var text = document.getElementById("text1").value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:3000/todos", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            things.push(text);
            document.getElementById("div1").innerHTML = things;
            if (typeof (Storage) !== "undefined") {
                localStorage.setItem("todos", JSON.stringify(things));
            } else {
                document.getElementById("div1").innerHTML = "Sorry, your browser does not support Web Storage...";
            }
            var json = JSON.parse(xhr.responseText);
            console.log(json);
        }
    };
    var data = JSON.stringify({"text": text});
    xhr.send(data);


   

}

