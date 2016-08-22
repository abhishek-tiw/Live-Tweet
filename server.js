var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var Twit = require('twit');
var TWEETS_BUFFER_SIZE = 1;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/js/app.js', function (req, res) {
    res.sendFile(__dirname + '/js/app.js');
});

app.get('/css/style.css', function (req, res) {
    res.sendFile(__dirname + '/css/style.css');
});

var T = new Twit({
    consumer_key: 'QoTjXkCnxWsyIJeXaiGFEwjJF',
    consumer_secret: '9GZHJnq9APhHWsYWpQ1gPXKK0QzO2MKHjsDBWOKtjOCyoMOwHS',
    access_token: '1591305378-PUbS8lCjTuMKN1l2zyFPMjvj9RxVMRnbsvoWyOU',
    access_token_secret: 'XTgb1zy6cCGwW9oG3NMD3fDeyCRV8rFeSyxUCETLxnpbz'
});

console.log("Listening for tweets");

var stream = T.stream('statuses/filter', {
    locations: [-122.75, 36.8, -121.75, 37.8]
//    locations: [-74,40,-73,41]
});

var tweetsBuffer = [];

stream.on('connect', function (request) {
    console.log('Connected to Twitter API');
});

stream.on('disconnect', function (message) {
    console.log('Disconnected from Twitter API. Message: ' + message);
});

stream.on('reconnect', function (request, response, connectInterval) {
    console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
})

stream.on('tweet', function (tweet) {
    if (tweet.place == null) {
        return;
    }

    //Create message containing tweet + username + profile pic + location
    var msg = {};
    msg.text = tweet.text;
    msg.location = tweet.place.full_name;
    msg.user = {
        name: tweet.user.name,
        image: tweet.user.profile_image_url
    };

    //push msg into buffer
    tweetsBuffer.push(msg);

    //send buffer only if full
    if (tweetsBuffer.length >= TWEETS_BUFFER_SIZE) {
        //broadcast tweets
        io.sockets.emit('tweets', tweetsBuffer);
        tweetsBuffer = [];
    }
});
