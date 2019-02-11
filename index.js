
const PORT = process.env.PORT ? process.env.PORT:'6968';
const PORT_REDIS = process.env.PORT_REDIS ? process.env.PORT_REDIS: '6379';
const HOST_REDIS = process.env.HOST_REDIS ? process.env.HOST_REDIS: 'localhost';
const cluster = require('cluster'),
    num_processes = require('os').cpus().length;

const main = require('./main.js');

console.log('Start * ');


async function init() {
    try {
        if (cluster.isMaster) {

            let available_port = [];

            for (var i = 0; i < num_processes; i++) {
                const worker = cluster.fork();
                // const new_port = parseInt(PORT) + i;
                const new_port = parseInt(PORT);

                available_port.push({port: new_port});
                worker.send({ message: 'Your PORT '+new_port, port: new_port });
                // console.log('master fork: '+i);

                worker.on('disconnect', (val) => {
                    console.log("disconnect")
                });
                
            }

            for (const id in cluster.workers) {
                cluster.workers[id].on('message', function(msg) {
                    //
                    console.log('Worker to master: ', msg);
                    available_port = available_port.map((val) => {
                        if (msg.port === val.port) {
                            val.pid = msg.pid;
                        }
                        return val;
                    });

                    console.log(available_port);
                });
            }

            cluster.on('exit', function(deadWorker, code, signal) {
                console.log('worker %d died (%s). restarting...',
                deadWorker.process.pid, signal || code);
                // Restart the worker
                var worker = cluster.fork();

                // Note the process IDs
                var newPID = worker.process.pid;
                var oldPID = deadWorker.process.pid;

                // Log the event
                console.log('worker '+oldPID+' died.');
                console.log('worker '+newPID+' born.');

                // console.log('available_port ',available_port);

                // for (var id in cluster.workers) {

                //     cluster.workers[id].kill();

                // }
                var temp = available_port.filter((val) => {
                    return val.pid === oldPID;
                })[0];
                console.log('old worker dead: ', temp);
                if (temp) {
                    worker.send({ message: 'Your Reborn in PORT '+temp.port, port: temp.port });
                }
            });
        } else if (cluster.isWorker) {

            console.log(`Worker ${process.pid} started and finished`);    

            process.on('message', function(msg) {
                // we only want to intercept messages that have a chat property
                console.log('Master to worker: ', msg);
                main.main(msg.port, {
                    PORT: PORT,
                    PORT_REDIS: PORT_REDIS,
                    HOST_REDIS: HOST_REDIS
                })

                process.send({ pid: process.pid, port: msg.port });
            });
        }
    } catch (e) {
        console.log("SCRIPT ERRROR", e);
    }
}

init();