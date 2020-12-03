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
        console.log("INFO: [iCal] Start Calendar Recording");
        ee.emit("recUpdate");
      }
    } else {
      if (recording) {
        recording = false;
        console.log("INFO: [iCal] Stop Calendar Recording");
        ee.emit("recUpdate");
      }
    }
  }
}

function filterEvents(event) {
  // Check based on recurrence rules
  if (event.rrule) {
    // Work around annoying RRule use of whole days only
    let today = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
    let tomorrow = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()+1);
    let rrToday = event.rrule.between(today,tomorrow,true);
    if (rrToday) {
      let rrEnd = new Date(rrToday[0]);
      rrEnd.setHours(event.end.getHours());
      rrEnd.setMinutes(event.end.getMinutes());
      rrEnd.setSeconds(event.end.getSeconds());
      if ((new Date(rrToday[0]) <= this.date) && (rrEnd >= this.date)) {
        return true
      }
    }
  }
  // Check based on specific recurrences
  if (event.recurrences) {
    if (Object.values(event.recurrences).find(filterEvents,{date: new Date()})) {
      return true;
    }
  }
  // Check based on overall date/time
  if ((event.start <= this.date) && (event.end >= this.date)) {
    return true;
  }
}

module.exports = {
    begin: begin,
    name: "iCal",
    event: ee,
    getRec: () => {return recording;},
}