var redis = require("redis"),
    client = redis.createClient('6379', 'localhost');

client.on("error", function (err) {
    console.error("Error " + err);
});
client.on('connect', function() {
    console.log('Redis client connected');
    for (var i = 0; i < 1000; i++) { 
        console.log('publish client i',i);
        client.publish('yuhu channel', 'key '+i);
    }
});