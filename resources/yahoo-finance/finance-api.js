//variáveis de import e constantes
var yahoo = require('yahoo-financial-data');
var amqp = require('amqplib/callback_api');
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const port = 3333;
app.use(bodyParser.json());
const defaultSDate = "2020-11-01"
const defaultEDate = "2020-11-20"
const STOCKS = ["GILD", "UNP", "UTX", "HPQ", "V", "CSCO", "SLB", "AMGN", "BA", "COP", "CMCSA", "BMY"]

//Funções auxiliares





amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  
  connection.createChannel(function(error1, channel) {
    app.listen(port, () =>{
        console.log('Started')
    })
    
    
  
    app.get('/', (req, res) => {
        res.type('application/json')
        sendHistory('V', defaultSDate, defaultEDate);
        res.send({})
        
    })

    if (error1) {
      throw error1;
    }

    var queue = 'stocks';
    var msg = 'novo pedido enviado';

    var sendHistory = (name, sDate, eDate) => {
        var response = {}
        yahoo.history(name, 'close', sDate, eDate, '1d', function (err, data) {
           response = {name : name, data: data};
           console.log(response)
           channel.sendToQueue(queue, Buffer.from(JSON.stringify(response)));
        });
    };

    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
    // setTimeout(function() { 
    //     connection.close(); 
    //     process.exit(0) 
    //     }, 500);
  });
});