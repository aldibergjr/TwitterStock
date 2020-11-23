var CONFIG = require('./config')
//TODO -> alterar URL "http://localhost:3333"

const stocks_url = 'http://c0c8377e6638.ngrok.io';
const tweets_url = 'http://60cdb8f88d95.ngrok.io';
var rest = require('rest');
var amqp = require('amqplib/callback_api');
const uuidv4 = require("uuid")
var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({port: 8080, path: '/application-server'});


var client_list = {};




//amqp://localhost
//TODO -> ALTERAR LINK PARA O REAL
amqp.connect(CONFIG.RABBITMQ_TWEETS, function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
        throw error1;
    }

    channel.consume("tweets_sentiment", function(msg) {
            console.log(" [x] Received tweets %s", msg.content.toString());
            var response = JSON.parse(msg.content.toString())
            var clientObj = client_list[response.id_hackadeira];
            if(!clientObj)
                return;
            
            if(!clientObj.tweets_changed)
                clientObj.tSendData = []
            clientObj.tSendData.push(response); 
            clientObj.tweets_changed = true;
        }, {
            noAck: true
        });

    });
});

amqp.connect(CONFIG.RABBITMQ_STOCKS, function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
        throw error1;
    }
   
    channel.consume("stocks", function(msg) {
            console.log(" [x] Received stock %s", msg.content.toString());
            var response = JSON.parse(msg.content.toString())
            //var clientObj = getClientById(response.id);
            var clientObj = client_list[response.id];
            if(!clientObj)
                return;

            
            if(!clientObj.stocks_changed)
                clientObj.sSendData = []
            clientObj.sSendData.push(response); 
            clientObj.stocks_changed = true;
           
        }, {
            noAck: true
        });
    });
});



//TODO -> HANDLE MULTIPLAS CONEXOES (só funciona pra 1 cliente)
wss.on('connection', function(ws) {
    console.log(ws);
    let unique_id = uuidv4.v4(); 
    client_list[unique_id] = {};
    client_list[unique_id].ws = ws 

    ws.on('message', function(message) {
        var action = JSON.parse(message.toString());
        console.log(action);
        if(action.type == "stock"){

            rest(stocks_url + action.resource + "/" + unique_id).then(res => {
                console.log("sent request to " + action.resource)
                console.log(res)
            })

        }else if(action.type == "tweet"){

            rest(tweets_url + action.resource + "/" + unique_id).then(res => {
                console.log("sent request to " + action.resource)
                console.log(res)
            })

        }
        
    });

    setInterval(()=>{
        if(!client_list[unique_id])
            return;

        if(client_list[unique_id].tweets_changed){
            ws.send(JSON.stringify({tweets: client_list[unique_id].tSendData}))
            client_list[unique_id].tweets_changed = false;
        }   
        if(client_list[unique_id].stocks_changed){
            ws.send(JSON.stringify({stocks: client_list[unique_id].sSendData}))
            client_list[unique_id].stocks_changed = false;
        }
    }, 1000)
   
});
