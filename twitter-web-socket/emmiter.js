var WebSocket = require('ws');

var connection = new WebSocket('ws://localhost:8080/testing')

connection.onopen = function(){
    console.log('Connection open!');
    sendMessage()    
}

function sendMessage() {
    connection.send('start stream')
    connection.close()
}

connection.onmessage = function(e){
    console.log(e.data)
}