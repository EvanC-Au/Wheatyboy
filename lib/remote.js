/*********************************************************************
 * Wheatyboy 🍞                                                      *        
 * *******************************************************************
 * remote.js                                                         *
 * *******************************************************************
 * Implementing remote control of WB using a minimal MQTT over       *
 * websockets broker, for use with Bitfocus Companion                *
 * Evan Cottle (evan@evancottle.net / evan@atcroductions.tv)         *
 * *******************************************************************
 * Credit: most of the MQTT/WS stuff from https://github.com/mqttjs/MQTT.js/blob/master/examples/ws/aedes_server.js     *
 * MQTT Notes:
 * FUNCTION                 TOPIC       PAYLOAD
 * Toggle auto enabled      "enable"    "true" (anything will do)
 * Feedback for Companion   "enstatus"  "true" or "false" (true means enabled)
 * *******************************************************************
 */

const aedes = require('aedes')()
const httpServer = require('http').createServer()
const WebSocket = require('ws')

const wss = new WebSocket.Server({ server: httpServer })

var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

var config;


function init(ldConfig) {
    config = ldConfig;

    wss.on('connection', function connection (ws) {
        const duplex = WebSocket.createWebSocketStream(ws)
        aedes.handle(duplex)
      })
      
      httpServer.listen(config.remoteWSport, function () {
        console.log('INFO: Remote control websocket server listening. Port:', config.remoteWSport)
      })
}

function pubStatus(topic, value) {
    aedes.publish({
        cmd: 'publish',
        topic: topic,
        payload: Buffer.from(value)
    });
}


aedes.on('clientError', function (client, err) {
  console.log('ERR: Remote client error', client.id, err.message, err.stack)
})

aedes.on('connectionError', function (client, err) {
  console.log('ERR: Remote connection error', client, err.message, err.stack)
})

aedes.on('publish', function (packet, client) {
  if (packet && packet.payload) {
      switch (packet.topic) {
          case "enable":
              ee.emit("enableChange", packet.payload.toString().toLowerCase());
              break;
      }
  //  console.log('DEBUG: publish packet:', packet.payload.toString())
  }
  if (client) {
 //   console.log('DEBUG: message from client', client.id)
  }
})

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log('INFO: Remote client subscribed', subscriptions, client.id)
  }
})

aedes.on('client', function (client) {
 // console.log('INFO: Remote client connected', client.id)
})




module.exports = {
    init: init,
    event: ee,
    pubStatus: pubStatus
}