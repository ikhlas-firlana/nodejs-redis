var redis = require("redis"),
    client = redis.createClient('6379', 'localhost');

client.on("error", function (err) {
    console.error("Error " + err);
});
client.on('connect', function() {
    console.log('Redis client connected');
    client.publish('yuhu channel', 'key');
});