#!/usr/bin/env node
/*********************************************************************
 * Wheatyboy 🍞                                                     *        
 * An agent to trigger recorders on events from Wheatstone consoles  *
 * Evan Cottle (evan@evancottle.net / evan@atcroductions.tv)         *
 * *******************************************************************
 * server.js                                                          *
 * *******************************************************************
 */

console.log("INFO: Starting Wheatyboy");

require("hjson/lib/require-config");
var config=require("./config.hjson");

var trigger;
var outputs = [];

switch (config.trigSource) {
    case "UDP":
        trigger = require("./lib/trigUDP.js");
        break;
    default:
        console.log("ERR: No valid trigger source defined");
        process.exit(1);
}

config.outputs.forEach(dest => {
    if (dest.enabled) {
        i = outputs.push(require(dest.module));
        outputs[i-1].init(dest.config);
    }
});

trigger.begin(config.trigConfig);

trigger.event.on("micChange", (micOn) => {
    outputs.forEach(out => {
        out.record(micOn);
    });
});


