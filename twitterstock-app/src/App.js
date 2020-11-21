import './App.css';
import contentJson from './output.json'

function App() {
  return (
    <div className="App">
      <h1 style={{ marginBottom: "5%" }}>Twitter stock search</h1>
      <div>
        <input placeholder="subject to analysis"></input>
        <button>Search</button>
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
