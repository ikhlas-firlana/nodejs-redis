exports.connect = async function Connect(client) {
    return new Promise((resolve, reject) => {
        client.on('connect', () => {
            console.log('connnect redis');
            resolve();
        });
        client.on('error', (err) => {
            console.err('error ', err);
            reject(err);
        })
    });
}
exports.get = async function Get(client, key) {
    return new Promise((resolve, reject) => {
        client.get('key', (err, data) => {
            if (err !== null) {
                reject(err)
            }
            console.log('get ', data);
            resolve(data);
        });
    });
}