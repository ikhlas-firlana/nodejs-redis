
const PORT = process.env.PORT ? process.env.PORT:'6969';
const PORT_REDIS = process.env.PORT_REDIS ? process.env.PORT_REDIS: '6379';
const HOST_REDIS = process.env.HOST_REDIS ? process.env.HOST_REDIS: 'localhost';
const main = require('./main.js');

require('sticky-cluster')(
 
    // server initialization function
    function (callback) {
    //   var http = require('http');
      var server = main.main(PORT, {
        PORT: PORT,
        PORT_REDIS: PORT_REDIS,
        HOST_REDIS: HOST_REDIS
    });
        
      // configure an app
        // do some async stuff if needed
        
      // don't do server.listen(), just pass the server instance into the callback
      callback(server);
    },
    
    // options
    {
      concurrency: require('os').cpus().length,
      port: PORT,
      debug: true,
      env: function (index) { return { stickycluster_worker_index: index }; }
    }
  );