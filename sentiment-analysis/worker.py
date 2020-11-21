import pika
import json
import logging
from sentiment import predict

logger = logging.getLogger('sentiment_analysis')
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
ch.setFormatter(logging.Formatter('%(asctime)s :: %(name)s :: [%(levelname)s] %(message)s'))
logger.addHandler(ch)

_EXCHANGE_ = 'twitter-stock'
_HOST_ = 'localhost'


if __name__ == "__main__":

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=_HOST_))
    channel = connection.channel()

    channel.exchange_declare(exchange=_EXCHANGE_, exchange_type='fanout')

    result = channel.queue_declare(queue='', exclusive=True)
    queue_name = result.method.queue

    channel.queue_bind(exchange=_EXCHANGE_, queue=queue_name)

    def callback(ch, method, properties, body):
        try:
            bodystr = body.decode()
            logger.info(f'RECEIVED: {bodystr}')

            tweet = json.loads(bodystr)
            logger.info(predict(tweet['text']))
        except Exception as e:
            logger.exception(e)

    channel.basic_consume(
        queue=queue_name, on_message_callback=callback, auto_ack=True)

    channel.start_consuming()
