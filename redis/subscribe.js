var redis = require("redis"),
    client = redis.createClient('6379', 'localhost');

client.on('message', (channel, message) => {
    console.log("channel " + channel + ": " + message);
})
client.subscribe('yuhu channel');