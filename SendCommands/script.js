
function sendCommand(command) {
    console.log(command);

    var xhr = new XMLHttpRequest();
    //var url = "http://0.tcp.ngrok.io:13717/snorre-pingu?";
    var url = "https://br2017team2.azurewebsites.net/snorre-pingu?";
    xhr.open("PATCH", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
        }
    };
    var data = JSON.stringify({ "nextCommand": command });
    xhr.send(data);

}