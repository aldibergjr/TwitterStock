FROM python:3.8-buster

WORKDIR /root

ENV EXCHANGE="twitter-stock"
ENV HOST="0.0.0.0"

COPY requirements.txt .
COPY model model
COPY sentiment.py .
COPY server.py .
COPY worker.py .

RUN pip install -r requirements.txt

CMD ["python", "server.py"]
