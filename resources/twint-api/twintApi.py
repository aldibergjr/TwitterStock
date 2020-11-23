import os
from flask import Flask
import twitter_worker
from pebble import ProcessPool

app = Flask(__name__)
processes = []


ranking_processes = twitter_worker.start_ranking_stream()


@app.route('/<query>/<uuid:_id>')
def hello_world(query, _id):
    for proc in processes:
        if proc["id"] == _id and proc["query"] == query:
            return {'failed': 'query already exists'}

    executor = ProcessPool()
    future = executor.schedule(twitter_worker.getTweets, args=(query, _id))
    processes.append({'process': future, 'query': query, 'id': _id})
    print(processes)
    return {'success': 'ack'}


@app.route('/cancel/<query>/<uuid:_id>')
def cancel_query(query, _id):
    for pross in processes:
        if pross["id"] == _id and pross["query"] == query:
            pross["process"].cancel()
            processes.remove(pross)
            print(processes)
    return {'sucess': 'removed'}


@app.route('/byDays/<startDate>/<endDate>/<query>/<uuid:_id>')
def byDays(startDate, endDate, query, _id):
    executor = ProcessPool()
    executor.schedule(twitter_worker.getByDay, args=[
                      startDate, endDate, query, _id])
    return {'sucess': 'days'}


app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000))
