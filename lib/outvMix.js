/*********************************************************************
 * Wheatyboy 🍞                                                      *        
 * *******************************************************************
 * outvMix.js                                                        *
 * *******************************************************************
 * Controls vMix using its web API                                   *
 * *******************************************************************
 */

const axios = require('axios').default;

var config;
var vmixAddress;

function init(ldConfig) {
    config = ldConfig;
    vmixAddress = "http://" + config.ip + ":" + config.port;
    axios.defaults.baseURL = vmixAddress;
    axios.defaults.timeout = 1000;
    console.log("INFO: vMix Output Enabled - " + vmixAddress);
}

function logError(e) {
    if (e.error != "recording not active") {
        console.log("ERR: [vMix]",e);
    }
}

function vMixCmd(cmd) {
    axios.get("/api/?Function=" + cmd)
    .then((response) => {
        // Success- let's check to be sure
        if (response.data != "Function completed successfully.") {
            logError(response);
        }
    })
    .catch(logError);
}

function record(recOn, force) {
    let overlayInput = ""
    if (recOn) {
        vMixCmd("StartRecording");
        overlayInput = config.overlayOnInput;
    } else {
        vMixCmd("StopRecording");
        overlayInput = config.overlayOffInput;
    }

    if (config.overlayEnabled) {
        if (overlayInput != "off") {
            vMixCmd(`OverlayInput${config.overlayID}In&Input=${overlayInput}`);
        } else {
            vMixCmd(`OverlayInput${config.overlayID}Out`);
        }
    }
}

module.exports = {
    init: init,
    record: record
}
