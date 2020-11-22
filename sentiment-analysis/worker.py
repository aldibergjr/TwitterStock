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

_HOST_ = os.environ.get('HOST', '0.0.0.0')


def work():
    try:
        queue_name = 'tweets'
        connection = pika.BlockingConnection(pika.URLParameters(_HOST_))
        channel = connection.channel()

        channel.queue_declare(queue='tweets', durable=True)

        def callback(ch, method, properties, body):
            bodystr = body.decode()
            logger.info(f'RECEIVED: {bodystr}')

            tweet = json.loads(bodystr)

            tweet['sentiment'] = predict(tweet['tweet'])

            logger.info(f'{tweet["tweet"]}: {tweet["sentiment"]}')

            # TODO: send to output queue
            ch.basic_ack(delivery_tag=method.delivery_tag)


        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue=queue_name,
                              on_message_callback=callback)

        logger.info('Consuming...')
        channel.start_consuming()
    except Exception as e:
        logger.exception(e)


if __name__ == "__main__":
    work()
