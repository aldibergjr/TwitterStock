import os
import re
import json
import logging
import pika
from sentiment import predict


def setup_logger(name: str):
    logger = logging.getLogger(f'SA_worker_{name}')
    logger.setLevel(logging.INFO)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    ch.setFormatter(logging.Formatter('%(asctime)s :: %(name)s :: [%(levelname)s] %(message)s'))  # noqa
    logger.addHandler(ch)
    return logger


_HOST_ = os.environ.get('HOST', '0.0.0.0')


def _deemojify(text):
    regrex_pattern = re.compile(pattern="["
                                u"\U0001F600-\U0001F64F"  # emoticons
                                u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                                u"\U0001F680-\U0001F6FF"  # transport & map symbols
                                u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                                "]+", flags=re.UNICODE)
    return regrex_pattern.sub(r'', text)


def _send_to_queue(msg: dict):
    queue_name = 'tweets_sentiment'
    connection = pika.BlockingConnection(pika.URLParameters(_HOST_))
    channel = connection.channel()

    channel.queue_declare(queue=queue_name, durable=True)

    channel.basic_publish(
        exchange='',
        routing_key=queue_name,
        body=json.dumps(msg),
        properties=pika.BasicProperties(
            delivery_mode=2,  # make message persistent
        ))
    connection.close()


def work(name: str):
    logger = setup_logger(name)
    try:
        queue_name = 'tweets'
        connection = pika.BlockingConnection(pika.URLParameters(_HOST_))
        channel = connection.channel()

        channel.queue_declare(queue='tweets', durable=True)

        def callback(ch, method, properties, body):
            tweets = json.loads(body.decode())
            for t in tweets['tweets']:
                pred = predict(_deemojify(t['tweet']))
                t['sentiment'] = 1 if pred else 0

            logger.info(
                f'{tweets["id_hackadeira"]} :: {100*sum([t["sentiment"] for t in tweets["tweets"]])/len(tweets["tweets"]):.2f}%') # noqa

            ch.basic_ack(delivery_tag=method.delivery_tag)
            _send_to_queue(tweets)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue=queue_name,
                              on_message_callback=callback)

        logger.info('Consuming...')
        channel.start_consuming()
    except Exception as e:
        logger.exception(e)


if __name__ == "__main__":
    work()
