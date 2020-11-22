FROM python:3.8-buster

WORKDIR /root

COPY requirements.txt .
RUN pip install -r requirements.txt

ENV NUM_WORKERS=5

COPY model model
COPY sentiment.py .
COPY server.py .
COPY worker.py .


CMD ["python", "server.py"]
