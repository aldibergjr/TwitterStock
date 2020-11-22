from flask import Flask
import twitter_worker
from pebble import ProcessPool

app = Flask(__name__)
processes = []

@app.route('/<query>')
def hello_world(query):
    executor = ProcessPool()
    future = executor.schedule(twitter_worker.getTweets, args=[query])
    processes.append({'process': future, 'query':query})
    print(processes)
    return {'success' : 'ack'}

@app.route('/cancel/<query>')
def cancel_query(query):
    for pross in processes:
        if(pross["query"] == query):
            pross["process"].cancel()
            processes.remove(pross)
            print(processes)

    return {'sucess' : 'removed'}

