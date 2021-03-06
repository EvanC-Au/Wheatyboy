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

var triggers = [];
var outputs = [];

var enabled = true;

var remote = require("./lib/remote.js");
remote.init(config);
setInterval(sendStatus,5000);



function sortMods (a, b) {
    if (a.priority < b.priority) {
        return -1;
    }
    if (a.priority > b.priority) {
        return 1;
    }
    return 0
}


config.triggers.sort(sortMods).forEach(trig => {
    if (trig.enabled) {
        i = triggers.push(require(trig.module));
        triggers[i-1].begin(trig.config);
        triggers[i-1].event.on("recUpdate", onRecUpdate);
    }
});

if (triggers.length === 0) {
    console.log("ERR: No valid trigger source defined");
    process.exit(1);
}

config.outputs.forEach(dest => {
    if (dest.enabled) {
        i = outputs.push(require(dest.module));
        outputs[i-1].init(dest.config);
    }
});

function onRecUpdate() {
    if (enabled) {
        // Loop through triggers to see whether any are saying to record - stop when we find one
        let rec = triggers.some((trig) => {
            if (trig.getRec()) {
                console.log("DEBUG: Recording update - triggered by:",trig.name);
                return true;
            } else {
                return false;
            }
        });
        if (!rec) {
            console.log("DEBUG: Recording update - not triggered");
        }
        outputs.forEach(out => {
            out.record(rec);
        });
    }
}

function sendStatus() {
    remote.pubStatus("enstatus", enabled.toString());
}

remote.event.on("enableChange", () => {
   enabled = !enabled;
   sendStatus();
})
