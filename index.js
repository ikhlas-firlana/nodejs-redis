const express = require('express'),
    bodyParser = require('body-parser'),
    redis = require("redis"),
    pkg = require("./redis/connect"),
    client = redis.createClient('6379', 'localhost');

async function main() { 

    await pkg.connect(client);

    const app = express();
    const PORT = process.env.PORT ? process.env.PORT:'3000';

    app.use(bodyParser.json());

    app.get('/', async (req, res) => {
        try {
            const hold = await pkg.get(client, 'key');
            console.log(typeof hold, hold);
            res.send('ok');
        } catch(e) {
            console.log(e);
            res.status(500);
        }  
    })

    app.listen(PORT,() => console.log(`Example app listening on port ${PORT}!`));
}

main()