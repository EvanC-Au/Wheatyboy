/*********************************************************************
 * Wheatyboy 🍞                                                      *        
 * *******************************************************************
 * outHELO.js                                                        *
 * *******************************************************************
 * Controls AJA HELO encoders using their REST API                   *
 * *******************************************************************
 */

const axios = require('axios').default;

var config;
var heloAddress;

function init(ldConfig) {
    config = ldConfig;
    heloAddress = "http://" + config.ip + ":" + config.port;
    axios.defaults.baseURL = heloAddress;
    axios.defaults.timeout = 1000;
    console.log("INFO: [HELO] HELO Output Enabled - " + heloAddress);
}

function logError(e) {
    if (e.error != "recording not active") {
        console.log("ERR: [HELO]",e);
    }
}

function record(recOn) {
    let heloCmd = 0;
    if (recOn) {
        heloCmd = 1;
    } else {
        heloCmd = 2;
    }
    axios.get("/config?action=set&paramid=eParamID_ReplicatorCommand&value=" + heloCmd)
        .then(() => {
            // Success
        })
        .catch(logError);
}

module.exports = {
    init: init,
    record: record
}
