/*********************************************************************
 * Wheatyboy 🍞                                                      *        
 * *******************************************************************
 * trigiCal.js                                                       *
 * *******************************************************************
 * Triggers forced recordings scheduled in an iCal (ICS) calendar    *
 * *******************************************************************
 */


const ical = require('node-ical');

var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

var recording = false;
var force = -1;

var calURL;
var calEvents;

function begin(config) {
  calURL = config.url;
  getEvents();
  setInterval(getEvents,config.updateFreq * 1000);
  checkEvents();
  setInterval(checkEvents, 2000);
}

function logError(e) {
  console.log("ERR: [iCal]",e);
}

function getEvents() {
  ical.async.fromURL(calURL)
    .then((events) => {
      calEvents = events;
      console.log(`INFO: [iCal] Calendar fetched from ${calURL}`)
      recording = false;  // Forces it to re-event, just in case
      checkEvents()})
    .catch(logError);
}

function checkEvents() {
  if (calEvents) {
    if (Object.values(calEvents).find(filterEvents,{date: new Date()})) {
      if (!recording) {
        recording = true;
        force = 1;
        ee.emit("recUpdate");
      }
    } else {
      if (recording) {
        recording = false;
        force = -1;
        ee.emit("recUpdate");
      }
    }
  }
}

function filterEvents(event) {
  if ((event.start <= this.date) && (event.end >= this.date)) {
    return true;
  }
}

module.exports = {
    begin: begin,
    event: ee,
    getRec: () => {return recording;},
    getForce:  () => {return force;}
}