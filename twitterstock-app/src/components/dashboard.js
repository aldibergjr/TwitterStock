import React, { useState, useEffect } from 'react'
//import { createBrowserHistory } from 'history';
//const history = createBrowserHistory();
import { Line, Pie } from 'react-chartjs-2';
import Search from '../assets/search.svg'

var ws = new WebSocket('ws://localhost:8080/application-server')

export default function Dashboard() {
    const [tweetQuery, setTweetQuery] = useState('$AAPL')
    const [stockQuery, setStockQuery] = useState('AAPL')
    const [searched, setSearched] = useState(false)
    const [tweets, setTweets] = useState([])
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Stock',
                tension: 0,
                borderWidth: 2,
                data: []
            },
            {
                label: 'TweetAnalysis',
                tension: 0,
                borderWidth: 2,
                data: []
            }
        ]
    })
    const[stockInfo,setStockInfo] = useState()

    var toCancel = ''

    function plotTwitterData(tweets) {
        var dayIndex = 0;
        tweets.forEach(tweet => {
            dayIndex += tweet.sentiment;
        })
        const date =new Date(tweets[0].date)
        setData({
            labels: [...data.labels,date],
            datasets: [
                {
                    label: 'Stock',
                    yAxisID: 'Stock',
                    tension: 0,
                    borderWidth: 2,
                    data: data.datasets[0].data
                },
                {
                    label: 'TweetAnalysis',
                    yAxisID: 'TweetAnalysis',
                    tension: 0,
                    borderWidth: 2,
                    data: [...data.datasets[1].data, dayIndex]
                }
            ]
        })
    }

    function plotYahooData(stocks) {
        setStockInfo({value:stocks[stocks.length-1],delta:stocks[stocks.length-1] - stocks[stocks.length-2],
            isIncreasing:stocks[stocks.length-1] > stocks[stocks.length-2]})
        setData({
            labels: data.labels,
            datasets: [
                {
                    label: 'Stock',
                    tension: 0,
                    borderWidth: 2,
                    data: stocks
                },
                {
                    label: 'TweetAnalysis',
                    tension: 0,
                    borderWidth: 2,
                    data: data.datasets[1].data
                }
            ]
        })
    }

    ws.onopen = function () {
        console.log('connected')
        searchTweet();
        setTimeout(() => {
            searchStock();
        }, 1000)
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
            console.log(message)
            plotYahooData(message.stocks[0].data)
        }
    }

    ws.onclose = () => {
        console.log('disconnected')
        // automatically try to reconnect on connection loss
    }

    function searchTweet() {
        ws.send(JSON.stringify({ 'type': 'tweet', 'resource': `/byDays/2020-11-16/2020-11-22/${tweetQuery}` }))
        toCancel = tweetQuery
        setSearched(true)
    }

    function searchStock() {
        ws.send(JSON.stringify({ 'type': 'stock', 'resource': `/stock/${stockQuery}/2020-11-15/2020-11-21` }))
    }


    function changeQuery(event) {
        event.persist()
        setTweetQuery(event.target.value)
    }

    function cancelQuery() {
        ws.send(JSON.stringify({ 'type': 'tweet', 'resource': `/cancel/${toCancel}` }))
    }

    const options = {
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
            }, {
                id: 'TweetAnalysis',
                position: 'right',
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

    function setGradientColor(canvas, color) {
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 450)
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.3, "rgba(150,0,150,0.4");
        gradient.addColorStop(0.5, "rgba(150,0,150,0)");
        return gradient;
    }

    const getChartData = canvas => {
        if (data.datasets) {
            let colors = ["rgba(150,0,150,0.8)", "rgba(0,255,0,0.8)"]
            data.datasets.forEach((set, i) => {
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
        return data
    }

    return (
        <div style={{ display: "flex", width: "100%", height: "100%", background: "#f0f3f8", overflowY: "auto", borderRadius: "30px 30px 30px 30px" }}>
            <div style={{ width: "70%", padding: "3% 5% 3% 5%", boxSizing: "border-box" }}>
                {/* <h1 style={{ margin: "0% 0% 3% 0%" }}>Dashboard</h1> */}
                <div style={{ display: "flex", height: "50%", padding: "4% 3% 4% 3%", background: "white", boxSizing: "border-box", borderRadius: "30px" }}>
                    <div style={{ width: "65%", boxSizing: "border-box", paddingRight: "3%" }}>
                        <h2 style={{ marginTop: "0%", marginBottom: "5%" }}>Twitter analysis recomendation</h2>
                        <Line responsive={true} data={getChartData} options={options} height={null} width={null} />
                    </div>
                    <div style={{ width: "35%", height: "100%", borderRadius: "15px", background: "#f0f3f8", boxSizing: "border-box", padding: "3%", overflowY: "hidden" }}>
                        <p style={{ margin: "0%", color: "rgb(190,190,190)", fontSize: "13px", fontWeight: "700" }}>stock info</p>
                        <p style={{fontSize:"20px",fontWeight:"700",marginTop:"5%"}}>{tweetQuery}</p>
                        <Pie data={{ labels: ['good', 'bad'], datasets: [{ data: [2000, 4000], backgroundColor: ["blue", "orange"] }] }} options={{ legend: { display: false }, elements: { arc: { borderWidth: 0 } } }} ></Pie>
                        <p>^Valor</p>
                    </div>
                </div>
                <div style={{ display: "flex", width: "100%", height: "50%", boxSizing: "border-box", padding: "4% 0% 0% 0%", justifyContent: "space-between" }}>
                    <div style={{ width: "30%", height: "100%", background: "white", boxSizing: "border-box", borderRadius: "25px", padding: "3% 2% 3% 2%", display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer" }}>
                        <div>
                            <p style={{ margin: "0px", fontWeight: "700", fontSize: "15px" }}>Fazer busca personalizada</p>
                            <p style={{ margin: "0px", fontSize: "10px", color: "gray" }}>procure por ações ou tópicos específicos</p>
                        </div>
                        <img src={Search}></img>
                    </div>
                    <div style={{ width: "66%", height: "100%", boxSizing: "border-box", overflowY: "auto" }}>
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
            <div style={{ width: "30%", background: "white", boxSizing: "border-box", padding: "2%", overflowY: "auto", borderRadius: "25px " }}>
                <h2>análises de sentimento</h2>
                <p>notificações</p>
                <div style={{ width: "100%", height: "200px", background: "#f0f3f8", borderRadius: "35px", margin: "5% 0% 5% 0%" }}></div>
            </div>
        </div>
    )
}