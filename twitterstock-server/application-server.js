//TODO -> Rest + websocket ...
const url = "localhost:3333"
var rest = require('rest');
var amqp = require('amqplib/callback_api');
var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({port: 8080, path: '/application-server'});

var tweets_queue = [];
var stocks_queue = [];
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
        throw error1;
    }
    channel.assertQueue("tweets", {
        durable: false
    });
    channel.assertQueue("stocks", {
        durable: false
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume("stocks", function(msg) {
            console.log(" [x] Received stock %s", msg.content.toString());
            tweets_queue.push(JSON.parse(msg.content.toString()))
        }, {
            noAck: true
        });
    });

    channel.consume("tweets", function(msg) {
        console.log(" [x] Received stock %s", msg.content.toString());
        tweets_queue.push(JSON.parse(msg.content.toString()))
    }, {
        noAck: true
    });


});




wss.on('connection', function(ws) {
    
    ws.on('message', function(message) {
        var action = JSON.parse(message.toString());
        console.log(action);

        // var input = message.toString().split("&_&");
        // if(input[0] == "newC"){
        //     users[input[1]] = ws;
        // }else{
        //     for(user in users){
        //         users[user].send(input[0] + ": " + input[1]);
        //     }
        // }
        // console.log('Msg received in server: %s ', message);
    });

    setInterval(()=>{
        if(tweets_queue.length > 0){
            ws.send(JSON.stringify({tweets: tweets_queue}))
            tweets_queue = [];
        }   
        if(stocks_queue.length > 0){
            ws.send(JSON.stringify({stocks: stocks_queue}))
            stocks_queue = [];
        }
    }, 2000)
    ws.send(req_list);
});