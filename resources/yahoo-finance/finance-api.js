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
const STOCKS = ["GILD", "UNP", "UTX", "HPQ", "V", "CSCO", "SLB", "AMGN", "BA", "COP", "CMCSA", "BMY", "VZ", "T", "UNH"];

//Funções auxiliares





amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  
  connection.createChannel(function(error1, channel) {
    app.listen(port, () =>{
        console.log('Started')
    })
    
    
    
    app.get('/stock/:name', (req, res) => {
        res.type('application/json')
        let name = req.params.name
        sendHistory(name, defaultSDate, defaultEDate);
        res.send({})
    })

    app.get('/stock/:name/:startDate/:endDate', (req, res) => {
      res.type('application/json')
      let name = req.params.name
      let startDate = req.params.startDate
      let endDate = req.params.endDate
      sendHistory(name, startDate, endDate);
      res.send({})
  })

    if (error1) {
      throw error1;
    }

    var queue = 'stocks';
    

    var sendHistory = (name, sDate, eDate) => {
        var response = {}
        yahoo.history(name, 'close', sDate, eDate, '1d', function (err, data) {
           response = {name : name, data: data, sDate: sDate, eDate: eDate};
           console.log(response)
           channel.sendToQueue(queue, Buffer.from(JSON.stringify(response)));
        });
    };

    STOCKS.forEach(e => {
      sendHistory(e, defaultSDate, defaultEDate);
    })
    
    channel.assertQueue(queue, {
      durable: false
    });
  });
});