//variáveis de import e constantes
const CONFIG = require('./config')
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





amqp.connect(CONFIG.RABBITMQ_STOCKS, function(error0, connection) {
  if (error0) {
    throw error0;
  }
  
  connection.createChannel(function(error1, channel) {
    app.listen(port, () =>{
        console.log('Started')
    })
    
    
    
    app.get('/stock/:name/:id', (req, res) => {
        res.type('application/json')
        let name = req.params.name
        let id = req.params.id;
        sendHistory(name, defaultSDate, defaultEDate , id);
        res.send({})
    })
    app.get('/aditionalData/:name/:id', (req,res)=>{
        let name = req.params.name;
        let id = req.params.id;
        aditionalData(name, id, {})
        res.send({"success" : true})
    })
    app.get('/stock/:name/:startDate/:endDate/:id', (req, res) => {
      res.type('application/json')
      let name = req.params.name
      let startDate = req.params.startDate
      let endDate = req.params.endDate
      let id = req.params.id;
      sendHistory(name, startDate, endDate , id);
      res.send({})
  })

    if (error1) {
      throw error1;
    }

    var queue = 'stocks';
    

    var sendHistory = (name, sDate, eDate, id) => {
        var response = {}
        yahoo.history(name, 'close', sDate, eDate, '1d', function (err, data) {
           response = {name : name, data: data, sDate: sDate, eDate: eDate, id:id};
           console.log(response)
           channel.sendToQueue(queue, Buffer.from(JSON.stringify(response)));
        });
    };
    var aditionalData = (name,id, currData) => {
      if(!currData.price){
        yahoo.price(name, (err, data) => {
          currData = {price: data, ...currData}
          aditionalData(name, id, currData);
        })
      }else if(!currData.analysis){
        yahoo.analystRecomendation(name, (err, data) => {
          currData = {analysis: data, ...currData}
          aditionalData(name, id, currData);
        })
      }else if(!currData.earnings){
        yahoo.earningsGrowth(name, (err, data) => {
          currData = {earnings: data, ...currData}
          aditionalData(name, id, currData);
        })
      }else if(!currData.revenue){
        yahoo.revenuePerShare(name, (err, data) => {
          currData = {revenue: data, ...currData}
          aditionalData(name, id, currData);
        })
      }else{
        //send to channel
        response = {name : name, addData: currData, id:id};
        console.log(response)
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(response)));
      }
    }

    // STOCKS.forEach(e => {
    //   sendHistory(e, defaultSDate, defaultEDate);
    // })
    
    channel.assertQueue(queue, {
      durable: false
    });
  });
});