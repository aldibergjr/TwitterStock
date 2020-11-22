import React, { useEffect } from 'react';

function service(){

    // instance of websocket connection as a class property
    ws = new WebSocket('ws://localhost:3000/ws')

    
    useEffect(() => {
        ws.onopen = () => {
        // on connecting, do nothing but log it to the console
        console.log('connected')
        }

        ws.onmessage = evt => {
        // listen to data sent from the websocket server
        const message = JSON.parse(evt.data)
        this.setState({dataFromServer: message})
        console.log(message)
        }

        ws.onclose = () => {
        console.log('disconnected')
        // automatically try to reconnect on connection loss
        }
        
    },[])

    function sendReq(){
        let value = document.getElementById("salve").value;
        var Req = {
            type: "stock",
            resource: "/stock/" + value
        }
        console.log(Req);
        connection.send(JSON.stringify(Req));
    
    }

    return(<ChildComponent websocket={this.ws} />)
        
}