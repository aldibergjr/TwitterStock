import twint
import json
import time
import pika
import os 

__HOST__ = os.environ.get('HOST', '0.0.0.0')

connection = pika.BlockingConnection(pika.URLParameters(__HOST__))
channel = connection.channel()
channel.queue_declare(queue='tweets', durable=True)


def getTweets(query):
    # Configure
    c = twint.Config()
    c.Search = query
    c.Limit = 100
    c.Pandas = True
    c.Hide_output = True
    
    twint.run.Search(c)
    Tweets_df =  twint.storage.panda.Tweets_df
    result = Tweets_df.to_json(orient="records") 
    parsed = json.loads(result)
    pos = 0
    count = 0
    sleepTime = 2

    while len(Tweets_df) > 0:
        if len(parsed) == 0:
            twint.run.Search(c)
            Tweets_df =  twint.storage.panda.Tweets_df
            result = Tweets_df.to_json(orient="records") 
            parsed = json.loads(result)
            pos = 0 
        else:
            message = parsed[pos:pos+10]

            for m in message:
                if m['language'] == 'en':
                    channel.basic_publish(
                        exchange='',
                        routing_key='tweets',
                        body=json.dumps(m),
                        properties=pika.BasicProperties(
                            delivery_mode=2, 
                        )
                    )
            
            parsed = parsed[pos+10:]  
            print('message sent from: ' + query) 	
        time.sleep(sleepTime)
        sleepTime = sleepTime + 0.05
        pos = pos + 10
        count = count +1



