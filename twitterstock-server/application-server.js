

//TODO -> alterar URL "http://localhost:3333"

const stocks_url = process.env.HOST_FINANCEAPI;
const tweets_url = process.env.HOST_TWINTAPI;
var rest = require('rest');
var amqp = require('amqplib/callback_api');
const uuidv4 = require("uuid")
var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({port: 8080, path: '/application-server'});


var client_list = {};




//amqp://localhost
//TODO -> ALTERAR LINK PARA O REAL
amqp.connect(process.env.HOST_RABBITMQ, function(error0, connection) {
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
