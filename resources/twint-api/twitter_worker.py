import twint
import json
import time
import pika
import os
import logging
from pebble import ProcessPool
from datetime import datetime, timedelta
from config import RABBITMQ_TWEETS

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

__HOST__ = RABBITMQ_TWEETS

connection = pika.BlockingConnection(pika.URLParameters(__HOST__))
channel = connection.channel()
channel.queue_declare(queue='tweets', durable=True)


def getTweets(query, _id):
    try:
        print(f'{_id}: {query}')
        # Configure
        c = twint.Config()
        c.Search = query
        c.Limit = 100
        c.Pandas = True
        c.Hide_output = True

        twint.run.Search(c)
        Tweets_df = twint.storage.panda.Tweets_df
        result = Tweets_df.to_json(orient="records")
        parsed = json.loads(result)
        pos = 0
        count = 0
        sleepTime = 2

        while len(Tweets_df) > 0:
            if len(parsed) == 0:
                twint.run.Search(c)
                Tweets_df = twint.storage.panda.Tweets_df
                result = Tweets_df.to_json(orient="records")
                parsed = json.loads(result)
                pos = 0
            else:
                message = parsed[pos:pos+20]

                for m in message:
                    if m['language'] == 'en':
                        res = {'id_hackadeira': str(_id), 'tweets': [m]}
                        channel.basic_publish(
                            exchange='',
                            routing_key='tweets',
                            body=json.dumps(res),
                            properties=pika.BasicProperties(
                                delivery_mode=2,
                            )
                        )

                parsed = parsed[pos+20:]
                print('message sent from: ' + query)
            time.sleep(sleepTime)
            sleepTime = sleepTime + 1
            pos = pos + 10
            count = count + 1
    except Exception as e:
        logger.exception(e)
        raise e


def toDateTime(string):
    return datetime.strptime(string, '%Y-%m-%d')


def DateToString(date):
    return date.strftime('%Y-%m-%d')


def getByDay(startDate, endDate, query, _id):
    try:
        startDate = toDateTime(startDate)
        endDate = toDateTime(endDate)

        while startDate <= endDate:
            # Configure
            s = DateToString(startDate)
            e = DateToString(startDate + timedelta(days=2))

            c = twint.Config()
            c.Search = query
            c.Limit = 20
            c.Pandas = True
            c.Hide_output = True
            c.Since = s
            c.Until = e
            c.Popular_tweets = True
            c.Filter_retweets = True

            twint.run.Search(c)
            Tweets_df = twint.storage.panda.Tweets_df
            result = Tweets_df.to_json(orient="records")
            parsed = json.loads(result)
            parsed = parsed[:20]
            parsed = {'id_hackadeira': str(_id), 'tweets': parsed}

            channel.basic_publish(
                exchange='',
                routing_key='tweets',
                body=json.dumps(parsed),
                properties=pika.BasicProperties(
                    delivery_mode=2,
                )
            )

            print('sent day ' + DateToString(startDate))
            startDate = startDate + timedelta(days=1)

    except Exception as e:
        logger.exception(e)
        raise e


def rank_work(ticker):
    # Configure
    c = twint.Config()
    c.Search = ticker
    c.Limit = 100
    c.Pandas = True
    c.Hide_output = True
    c.Filter_retweets = True

    twint.run.Search(c)
    Tweets_df = twint.storage.panda.Tweets_df
    result = Tweets_df.to_json(orient="records")
    parsed = json.loads(result)
    pos = 0
    count = 0
    sleepTime = 2

    while len(Tweets_df) > 0:
        if len(parsed) == 0:
            twint.run.Search(c)
            Tweets_df = twint.storage.panda.Tweets_df
            result = Tweets_df.to_json(orient="records")
            parsed = json.loads(result)
            pos = 0
        else:
            message = parsed[pos:pos+20]

            for m in message:
                if m['language'] == 'en':
                    print(f'sending stream for: {ticker}')
                    res = {'tweets': [m], 'id_hackadeira': 'ranking'}
                    channel.basic_publish(
                        exchange='',
                        routing_key='tweets',
                        body=json.dumps(res),
                        properties=pika.BasicProperties(
                            delivery_mode=2,
                        )
                    )

            parsed = parsed[pos+20:]
        time.sleep(5)
        pos = pos + 20
        count = count + 1


def start_ranking_stream():
    print('Starting stream...')
    tickers = ["$GILD", "$UNP", "$UTX", "$HPQ", "$V", "$CSCO", "$SLB",
               "$AMGN", "$BA", "$COP", "$CMCSA", "$BMY", "$VZ", "$T", "$UNH"]

    executor = ProcessPool()

    futures = []

    try:
        for ticker in tickers:
            futures.append(executor.schedule(rank_work, args=[ticker]))

        print(futures)
        return futures
    except Exception as e:
        logger.exception(e)
        raise e
