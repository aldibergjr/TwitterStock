FROM python:3.9-buster

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY twintApi.py .
COPY twitter_worker.py .

CMD ["python", "twintApi.py"]