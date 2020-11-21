import os
import json
import logging
import pika
from sentiment import predict

logger = logging.getLogger('sentiment_worker')
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
ch.setFormatter(logging.Formatter('%(asctime)s :: %(name)s :: [%(levelname)s] %(message)s'))  # noqa
logger.addHandler(ch)

_EXCHANGE_ = os.environ.get('EXCHANGE', 'twitter-stock')
_HOST_ = os.environ.get('HOST', '0.0.0.0')

def work():
    try:
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

                # TODO: send to output queue
            except Exception as e:
                logger.exception(e)
                pass

        channel.basic_consume(queue=queue_name,
                                on_message_callback=callback,
                                auto_ack=True)

        logger.info('Consuming...')
        channel.start_consuming()
    except Exception as e:
        logger.exception(e)

if __name__ == "__main__":
    work()
