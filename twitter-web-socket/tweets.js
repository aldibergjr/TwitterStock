var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({port: 8080, path: '/testing'});
const Twit = require('twit')
var credentials = require('./credentials')

var T = new Twit(credentials);

let stream = T.stream('statuses/filter', { track: '$AMZN' });
let isStreamStopped = false;

function getTweetObject(tweet) {
    let tweetText = (tweet.extended_tweet) ? tweet.extended_tweet.full_text : tweet.text;

    // check for retweets
    if (tweet.text.includes('RT @') && tweet.retweeted_status) {
        tweetText = (tweet.retweeted_status.extended_tweet) ? tweet.retweeted_status.extended_tweet.full_text : tweet.retweeted_status.text;
    }

    let TweetObject = {
        text: tweetText,
        user: tweet.user.name,
        location: (tweet.user.location !== null) ? tweet.user.location : '',
        followers: tweet.user.followers_count,
        userImage: tweet.user.profile_image_url,
        timestamp: tweet.timestamp_ms,
    };

    return TweetObject;
}

wss.on('connection', function (socket) {
    console.log('sockets connected');
    socket.on('message', () => {
        console.log('started streaming tweets');

        stream.on('tweet', function (tweet) {
            console.log('tweeting');

            let TweetObject = getTweetObject(tweet);
            console.log(TweetObject)
        });

        stream.start();

        isStreamStopped = false;
    });
});




