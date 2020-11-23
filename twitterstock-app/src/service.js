import React, { useEffect } from 'react';

export function Service(){

    // instance of websocket connection as a class property
    var ws = new WebSocket('ws://localhost:8080/application-server')

    
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
        ws.send(JSON.stringify(Req));
    
    }

    return(<div> {ws} </div>)
        
}