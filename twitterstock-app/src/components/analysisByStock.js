import React, { useState, useEffect } from 'react'
import { Line, Pie } from 'react-chartjs-2';
//import { createBrowserHistory } from 'history';
//const history = createBrowserHistory();

var ws = new WebSocket('ws://31f508a4518a.ngrok.io/application-server')
export default function AnalisysByStock() {
    const [stock, setStock] = useState('');
    const [tweets, setTweets] = useState([])
    const [aditionalData, setAditionalData] = useState(null)
    const [stockData, setStockData] = useState({
        labels: [],
        datasets:[{
            label:'Stocks',
            tension: 0,
            borderWidth: 2,
            data: []
        }]
    })
    const [tweetData, setTweetData] = useState({
        labels: [],
        datasets:[{
            label:'TweetAnalysis',
            tension: 0,
            borderWidth: 2,
            data: []
        }]
    })

    const options_stock = {
        scales: {
            'scaleShowLabels': false,
            xAxes: [{
                display: false
            }],
            yAxes: [{
                id: 'Stock',
                position: 'left',
                gridLines: {
                    color: "rgba(240, 240, 240, 0.5)",
                },
                ticks: {
                    fontColor: "rgba(200, 200, 200, 1)",
                }
            }]
        },
        elements: {
            point: {
                radius: 0,
            }
        },
        legend: {
            display: false
        },
        aspectRatio: 2
    }
    const options_tweet = {
        scales: {
            'scaleShowLabels': false,
            xAxes: [{
                display: false
            }],
            yAxes: [{ 
                id: 'TweetAnalysis',
                position: 'left',
                gridLines: {
                    color: "rgba(240, 240, 240, 0.5)",
                },
                ticks: {
                    fontColor: "rgba(200, 200, 200, 1)",
                }
            }]
        },
        elements: {
            point: {
                radius: 0,
            }
        },
        legend: {
            display: false
        },
        aspectRatio: 2
    }

    
    ws.onopen = function () {
        console.log('connected')
        
    }

    ws.onmessage = function (evt) {
        // listen to data sent from the websocket server
        const message = JSON.parse(evt.data)
        //this.setState({dataFromServer: message})
        if (message.tweets) {
            console.log(message)
            setTweets(message.tweets[0].tweets)
            plotTwitterData(message.tweets[0].tweets)
        } else if (message.stocks) {
            message.stocks.forEach(s=>{
                if(s.data){
                    console.log(message)
                    plotYahooData(s.data)
                }else{
                    setAditionalData(s.addData)
                }
            })
            
            
        }
    }

    var changeStock = (e) => {
        e.persist();
        setStock(e.target.value);
    }

    var getTweetStock = () => {
        ws.send(JSON.stringify({ 'type': 'stock', 'resource': `/stock/${stock}/2020-11-15/2020-11-21` }))
        ws.send(JSON.stringify({ 'type': 'tweet', 'resource': `/byDays/2020-11-16/2020-11-22/\$${stock}` }))
        ws.send(JSON.stringify({ 'type': 'stock', 'resource': `/aditionalData/${stock}` }))
    }
    var setGradientColor = (canvas, color) => {
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 450)
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.3, "rgba(150,0,150,0.4");
        gradient.addColorStop(0.5, "rgba(150,0,150,0)");
        return gradient;
    }
    var getStockData = canvas => {
        if (stockData.datasets) {
            let colors = ["rgba(150,0,150,0.8)", "rgba(0,255,0,0.8)"]
            stockData.datasets.forEach((set, i) => {
                set.backgroundColor = setGradientColor(canvas, colors[i])
                set.borderColor = "rgba(150,0,150,0.8)"
                set.borderWidth = 2
                if (i == 1) {
                    set.borderColor = 'green'
                    set.backgroundColor = "rgb(0,0,0,0)"
                    set.borderWidth = 1
                    set.tension = 0.3
                }
            })
        }
        return stockData;
    }
    var getTweetData = canvas => {
        if (tweetData.datasets) {
            let colors = ["rgba(150,0,150,0.8)", "rgba(0,255,0,0.8)"]
            tweetData.datasets.forEach((set, i) => {
                set.backgroundColor = setGradientColor(canvas, colors[i])
                set.borderColor = "rgba(150,0,150,0.8)"
                set.borderWidth = 2
                if (i == 0) {
                    set.borderColor = 'green'
                    set.backgroundColor = "rgb(0,0,0,0)"
                    set.borderWidth = 1
                    set.tension = 0.3
                }
            })
        }
        return tweetData;
    }
    function plotYahooData(stocks) {
        setStockData({
            labels: stockData.labels,
            datasets: [
                {
                    label: 'Stock',
                    tension: 0,
                    borderWidth: 2,
                    data: stocks
                }
            ]
        })
    }
    function plotTwitterData(tweets) {
        var dayIndex = 0;
        tweets.forEach(tweet => {
            dayIndex += tweet.sentiment;
        })
        const date =new Date(tweets[0].date)
        setTweetData({
            labels: [...tweetData.labels,date],
            datasets: [
                {
                    label: 'TweetAnalysis',
                    yAxisID: 'TweetAnalysis',
                    tension: 0,
                    borderWidth: 2,
                    data: [...tweetData.datasets[0].data, dayIndex]
                }
            ]
        })
    }


    return (
        <div style={{display: "block",height:"100%",background: "#F0F3F8", padding: "0% 2% 0% 2%" }}>
           
            <h1 style={{ margin: "0% 0% 3% 0%", paddingTop:"2%" }}>AnalysisByStock</h1>
            <input onChange={changeStock} style={{marginBottom: "10px"}}placeholder="Digite o nome da stock"/>
            <button onClick={getTweetStock} style={{border: "none", outline: "none", padding: "3px", backgroundColor: "darkgray", marginLeft: "5px" }}>Procurar</button>
            <div style={{ display: "flex", justifyContent:"space-between",width:"100%",height:"75%"}}>
                <div style={{width:"49%",height:"100%",background:"white",borderRadius:"5px",display:"flex"
            ,flexDirection:"column",textAlign:"center"}}>
                {/* grafico 1 */}
            {stock?<h1>Buscar dados da stock {stock}</h1>:""}
                <Line responsive={true} data={getStockData} options={options_stock} height={null} width={null} />
                {aditionalData? <div><hr></hr>
                    <label>Receitar por share: ${aditionalData.revenue}</label><hr></hr>
                    <label>PGE ratio: ${aditionalData.earnings}</label><hr></hr>
                    <label>Sugestão dos analistas: ${aditionalData.analysis}</label><hr></hr>
                    <label>Preço atual: ${aditionalData.price}</label>
                </div>: ""}
                
            </div>
                <div style={{width:"49%",height:"100%",background:"white",borderRadius:"5px",display:"flex"
            ,flexDirection:"column",textAlign:"center", overflowY:"scroll"}}>
                {/* grafico 2 */}
                {stock?<h1>Buscar tweets da stock {stock}</h1>:""}
                <Line responsive={true} data={getTweetData} options={options_tweet} height={null} width={null} />
                <h2>Tweets feed</h2>
                        {tweets.map((tweet, key) => {
                            return (
                                <div key={key} style={{ display: "flex", padding: "5% 0% 5% 0%", borderBottom: "0.3px solid rgb(180,180,180,0.3)" }}>
                                    <img style={{ width: "50px", height: "50px", borderRadius: "15px" }} src="https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png"></img>
                                    <div style={{ display: "block", padding: "0% 5% 0% 5%", boxSizing: "border-box" }}>
                                        <h3 style={{ margin: "0%", fontSize: "15px", fontWeight: "500", color: "lightblue" }}>{"@" + tweet.username}</h3>
                                        <h3 style={{ margin: "0%", fontSize: "15px", fontWeight: "400", }}>{tweet.tweet}</h3>
                                    </div>
                                </div>
                            )
                        })}
            </div>
            </div>
        </div>
    )
}