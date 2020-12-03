/*********************************************************************
 * Wheatyboy 🍞                                                      *        
 * *******************************************************************
 * trigUDP.js                                                        *
 * *******************************************************************
 * Recieves events from console using simple UDP packets             *
 * *******************************************************************
 */

fs = require('fs');
var logstream;
var cfg;

var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

let recording;

var udp = require('dgram');
const { config } = require('process');
//const { config } = require('process');
const server = udp.createSocket('udp4');

function begin(config) {
  cfg = config;
    console.log("INFO: Starting UDP server. Port:", cfg.port);
    server.bind(cfg.port);
    if (cfg.logging) {
      logstream = fs.createWriteStream(cfg.logfile, {flags:'a'});
      setInterval(flushLog,30000);  // Flush the log by closing and reopening every 30 sec
    }
}

function flushLog() {
  logstream.end(() => {
    logstream = fs.createWriteStream(cfg.logfile, {flags:'a'});
  });
}

function logToFile(data) {
  if (logstream) {
    logstream.write(new Date().toISOString() + ": " + data + "\r\n");
  }
  if (cfg.consoleLogging) {
    console.log("DEBUG: [UDP/data]",data);
  }
}

server.on('error', (err) => {
    console.log(`ERR: UDP Server error:\n${err.stack}`);
    server.close();
  });
  
  server.on('message', (msg, rinfo) => {
    logToFile(msg.toString().trim());
    switch (msg.toString().trim()) {
        case "MICS ON":
            recording = true;
            break;
        case "MICS OFF":
            recording = false;
            break;
    }
    ee.emit("recUpdate");
  });
  
  server.on('listening', () => {
    const address = server.address();
    console.log(`INFO: Listening on UDP`, `${address.address}:${address.port}`);
  });
  


module.exports = {
    begin: begin,
    name: "UDP",
    event: ee,
    getRec: () => {return recording;},
}