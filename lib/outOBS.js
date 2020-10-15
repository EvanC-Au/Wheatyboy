const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
var config;
var obsConnected = false;
var obsAddress

function init(ldConfig) {
    config = ldConfig;
    obsAddress = config.ip + ":" + config.port;
    console.log("INFO: OBS Output Enabled - " + obsAddress);

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
    if (e.error != "recording not active") {
        console.log("ERR:",e);
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
                    }
                 else if (!recOn) {
                    obs.send("StopRecording").then(()=> {
                        if (config.switchScenes) {
                            obs.send("SetCurrentScene",{"scene-name":config.offScene}).catch(logError);
                        }   
                    }).catch(logError);
                    }
    }    
}

obs.on('ConnectionOpened', (e) => {console.log("INFO: Connected to OBS");});
obs.on('ConnectionClosed', (e) => {
    console.log("WARN: Disconnected from OBS");
    obsConnected = false;});
obs.on('AuthenticationSuccess', (e) => {console.log("INFO: Authenticated with OBS");});
obs.on('AuthenticationFailure', (e) => {
    console.log("ERR: Failed to authenticate with OBS");
    obsConnected = false;});

obs.on('error', err => {
    console.error('ERR:', err);
});


module.exports = {
    init: init,
    record: record
}