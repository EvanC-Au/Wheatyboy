/*********************************************************************
 * Wheatyboy 🍞                                                      *        
 * *******************************************************************
 * outOBS.js                                                         *
 * *******************************************************************
 * Controls OBS Studio using the OBS Websocket plugin                *
 * *******************************************************************
 */

const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
var config;
var obsConnected = false;
var obsAddress
var forced = false;
var splitRecTimeout = false;
var splitRestartTries = 0;

function init(ldConfig) {
    config = ldConfig;
    obsAddress = config.ip + ":" + config.port;
    console.log("INFO: [OBS] OBS Output Enabled - " + obsAddress);

    obsConnect();
    setInterval(obsConnect,config.reconnect);

}

function obsConnect() {
    if (!obsConnected) {
        obs.connect({ address: obsAddress, password: config.password }).then(() => {
            obsConnected = true;
        }).catch(() => {});   
    }
}

function logError(e) {
    if ((e.error != "recording not active")&&(e.error != "recording already active")) {
        console.log("ERR: [OBS]",e);
    }
}

function record(recOn) {
    if (obsConnected) {
                if (recOn) {
                    if (config.switchScenes) {
                        obs.send("SetCurrentScene",{"scene-name":config.onScene}).then(()=> {
                            obs.send("StartRecording").catch(logError);
                    }).catch(logError);
                    } else {
                        obs.send("StartRecording").catch(logError);
                    }
                    resetSplit();
                    }
                 else if (!recOn) {
                    obs.send("StopRecording").then(()=> {
                        if (config.switchScenes) {
                            obs.send("SetCurrentScene",{"scene-name":config.offScene}).catch(logError);
                        }   
                    }).catch(logError);
                    clearTimeout(splitRecTimeout);
                    splitRecTimeout = false;
                    }
    }    
}

function resetSplit() {
    clearTimeout(splitRecTimeout);
    splitRecTimeout = setTimeout(splitRec,config.splitTimeout * 1000);
}

function splitTryRestart() {
    if (splitRecTimeout) {
        splitRestartTries++;
        //console.log(`INFO: [OBS] Recording splitting (${splitRestartTries}...)`)
        obs.send("StartRecording").catch(() => {
            if (splitRestartTries <= 200) {
                setTimeout(splitTryRestart,100);
            } else {
                console.log("ERR: [OBS] Couldn't restart recording after split")
            } 
        });   
    }
}

function splitRec() {
    resetSplit();
    if (config.splitFiles) { 
        obs.send("StopRecording").then(()=> {
            splitRestartTries = 0;
            setTimeout(splitTryRestart, 750);
        }).catch(logError);
    }
}

obs.on('ConnectionOpened', (e) => {console.log("INFO: [OBS] Connected to OBS");});
obs.on('ConnectionClosed', (e) => {
    console.log("WARN: [OBS] Disconnected from OBS");
    obsConnected = false;});
obs.on('AuthenticationSuccess', (e) => {console.log("INFO: [OBS] Authenticated with OBS");});
obs.on('AuthenticationFailure', (e) => {
    console.log("ERR: [OBS] Failed to authenticate with OBS");
    obsConnected = false;});

obs.on('error', err => {
    console.error('ERR: [OBS]', err);
});


module.exports = {
    init: init,
    record: record
}