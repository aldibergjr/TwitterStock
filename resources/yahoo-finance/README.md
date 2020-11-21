# Serviço yahoo-finance-api

Nome da queue = "stocks"
Inicialmente envia as seguintes stocks (dia 1-20 de novembro)

```
["GILD", "UNP", "UTX", "HPQ", "V", "CSCO", "SLB", "AMGN", "BA", "COP", "CMCSA", "BMY", "VZ", "T", "UNH"]
```

--- 

### Links dos serviços

Nenhuma das funções retorna nada pelo rest, mas são triggers para envio na fila do RabbitMQ


`GET` **/stock/NOME**
retorna os dados da stock com o nome passado nos dias 1-20 de novembro

`GET` **/stock/NOME/DATA_INICIO/DATA_FIM**
data_inicio e fim no formato ANO(yyyy)-MES(MM)-DIA(dd), retorna os dados da stock no intervalo especificado

