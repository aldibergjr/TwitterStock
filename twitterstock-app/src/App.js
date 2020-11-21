import './App.css';
import contentJson from './output.json'

function App() {
  return (
    <div className="App">
      <h1 style={{marginBottom:"5%"}}>Search values: @realDonaldTrump count</h1>
      {contentJson.map(tweet=>{
        return(
          <div>

            <h1 style={{color:"lightblue"}}>{"@"+tweet.username}</h1>
            <h2>{tweet.tweet}</h2>
          </div>
        )
      })}
    </div>
  );
}

export default App;
