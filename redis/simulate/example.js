var redis = require("redis"),
    client = redis.createClient('6379', 'localhost');

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });
function main() {
    client.on("error", function (err) {
        console.log("Error " + err);
    });
    client.on('connect', function() {
        console.log('Redis client connected');
        client.set('key', '1234567', 'EX', 5);
        // client.on("subscribe", (channel, count) => {
        client.publish('yuhu channel', 'key');
        // });
    });
}

main()