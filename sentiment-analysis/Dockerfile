FROM python:3.8-buster

WORKDIR /root

COPY requirements.txt .
RUN pip install -r requirements.txt


COPY model model
COPY sentiment.py .
COPY server.py .
COPY worker.py .
COPY config.py .

ENV NUM_WORKERS=4

CMD ["python", "server.py"]
