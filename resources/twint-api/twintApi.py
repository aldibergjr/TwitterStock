from flask import Flask
import twitter_worker
from concurrent.futures import ProcessPoolExecutor

app = Flask(__name__)

@app.route('/<query>')
def hello_world(query):
    executor = ProcessPoolExecutor()
    executor.submit(twitter_worker.getTweets, query)
    return {'success' : 'ack'}



