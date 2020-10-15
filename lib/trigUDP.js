var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

var udp = require('dgram');
const server = udp.createSocket('udp4');

function begin(config) {
    console.log("INFO: Starting UDP server. Port:", config.port);
    server.bind(config.port);
}

server.on('error', (err) => {
    console.log(`ERR: UDP Server error:\n${err.stack}`);
    server.close();
  });
  
  server.on('message', (msg, rinfo) => {
    switch (msg.toString().trim()) {
        case "MICS ON":
            ee.emit("micChange",true)
            break;
        case "MICS OFF":
            ee.emit("micChange",false)
            break;
    }
  });
  
  server.on('listening', () => {
    const address = server.address();
    console.log(`INFO: Listening on UDP`, `${address.address}:${address.port}`);
  });
  


module.exports = {
    begin: begin,
    event: ee
}