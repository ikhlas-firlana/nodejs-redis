
const PORT = process.env.PORT ? process.env.PORT:'6969';
const PORT_REDIS = process.env.PORT_REDIS ? process.env.PORT_REDIS: '6379';
const HOST_REDIS = process.env.HOST_REDIS ? process.env.HOST_REDIS: 'localhost';
const express = require('express'),
    bodyParser = require('body-parser'),
    redis = require("redis"),
    pkg = require("./redis"),
    client = redis.createClient(PORT_REDIS, HOST_REDIS);

async function main() { 

    await pkg.connect(client);

    const app = express();

    const server = app.listen(PORT,() => console.log(`app listening on port ${PORT}!`));
    console.log(`HOST_REDIS ${HOST_REDIS}!`)
    console.log(`PORT_REDIS ${PORT_REDIS}!`)
    const io = require('socket.io')(server, {
        transports: [ 'polling', 'websocket' ],
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false
    });

    app.use(bodyParser.json());

    //set the template engine ejs
    app.set('view engine', 'ejs');
    // app.set('sockerio', io);

    //middlewares
    app.use(express.static('public'))

    app.get('/', async (req, res) => {
        try {
            res.render('index');
        } catch(e) {
            console.log(e);
            res.status(500);
        }  
    });

    // index
    app.get('/mock', async (req, res) => {
        try {
            const hold = await pkg.get(client, 'key');
            console.log(typeof hold, hold);
            res.send();
        } catch(e) {
            console.log(e);
            res.status(500);
        }  
    });
    // get connections
    io.on('connection', (socket) => {
        console.log('New user connected: + :', Object.keys(io.sockets.sockets).length);
        // console.log(count);

        //default username
        socket.username = "Anonymous"

        //listen on change_username
        socket.on('change_username', (data) => {
            socket.username = data.username
        })

        //listen on new_message
        socket.on('new_message', (data) => {
            //broadcast the new message
            console.log(`> ${JSON.stringify(data)}`);
            io.sockets.emit('new_message', {message : data.message, username : socket.username});
        })

        //listen on typing
        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', {username : socket.username})
        });

        socket.on('disconnect', (reason) => { 
            console.log('Disconnect: '+reason,": ", Object.keys(io.sockets.sockets).length);
        });

        socket.on('error', (error) => {
            console.error('Error: ', error);
        });
    });

    client.on('message', (channel, message) => {
        console.log("redis channel " + channel + ": " + message);
        io.sockets.emit('new_message', {message : message, username :channel});
    
    });
    client.subscribe('yuhu channel');
}

main()