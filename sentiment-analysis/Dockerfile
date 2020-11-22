FROM python:3.8-buster

WORKDIR /root

COPY requirements.txt .
RUN pip install -r requirements.txt

ENV HOST="amqps://zwffucpz:NcJ2ApBRCJdXnJ7f0g96An0aqb2N-5Ms@toad.rmq.cloudamqp.com/zwffucpz"
ENV NUM_WORKERS=3

COPY model model
COPY sentiment.py .
COPY server.py .
COPY worker.py .


CMD ["python", "server.py"]
