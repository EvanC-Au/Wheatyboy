/*********************************************************************
 * Wheatyboy 🍞                                                      *        
 * *******************************************************************
 * trigCron.js                                                       *
 * *******************************************************************
 * Triggers recordings using a simple Cron-like format               *
 * *******************************************************************
 */

// WORK IN PROGRESS

var parser = require('cron-parser');

var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

var recording = false;


function begin(config) {
 
}

function logError(e) {
  console.log("ERR: [Cron]",e);
}



module.exports = {
    begin: begin,
    name: "Cron",
    event: ee,
    getRec: () => {return recording;},
}