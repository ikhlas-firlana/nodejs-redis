var net = require('net');

exports.portInUse = async function(port) {
    return new Promise((resolve, reject) => {
        var server = net.createServer(function(socket) {
            socket.write('Echo server\r\n');
            socket.pipe(socket);
            });
        
            server.listen(port, '127.0.0.1');
            server.on('error', function (e) {
                console.log('error still running ', e);
                resolve(true);
            });
            server.on('listening', function (e) {
                console.log('listening ', e);
                server.close();
                resolve(false);
            });
    });
};
;