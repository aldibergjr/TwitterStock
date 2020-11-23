import './App.css';
import contentJson from './output.json'
import rest from 'rest'
import { useEffect, useState } from 'react';
var ws = new WebSocket('ws://localhost:8080/application-server')

function App() {
  const  [query, setQuery] = useState('')

    
    ws.onopen = function(){
      console.log('connected')
    }

    ws.onmessage = function(evt) {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data)
      //this.setState({dataFromServer: message})
      console.log(message)
    }

      ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      }
  


  function searchTweet(){
    ws.send(JSON.stringify({'type': 'tweet', 'resource': `/${query}`}))
  }

  function changeQuery(event){
    event.persist()
    setQuery(event.target.value)
  }

  function cancelQuery() {
    ws.send(JSON.stringify({'type': 'tweet', 'resource': `/cancel/${query}`}))
  }

  return (
    <div className="App">
      <h1 style={{ marginBottom: "5%" }}>Twitter stock search</h1>
      <div>
        <input onChange={changeQuery} placeholder="subject to analysis"></input>
        <button onClick={searchTweet}>Search</button>
        <button onclick={cancelQuery} >CANCELADO!!</button>
      </div>
      <div>
        {contentJson.map((tweet,index) => {
          return (
            <div>
              <h1>{index}</h1>
              <h1 style={{ color: "lightblue" }}>{"@" + tweet.username}</h1>
              <h2>{tweet.tweet}</h2>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
