FROM python:3.9

WORKDIR /root

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY twintApi.py .
COPY twitter_worker.py .
COPY config.py .

ENV FLASK_APP="twintApi"

CMD ["python", "twintApi.py"]