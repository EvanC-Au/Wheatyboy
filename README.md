# Wheatyboy 🍞                                                           
An agent to trigger recorders on events from Wheatstone consoles

Evan Cottle (evan@evancottle.net / evan@atcroductions.tv)        

## Installation
1. Download contents of repo and put somewhere that suits.
1. Navigate to folder and run `npm install`
1. (Recommended) Globally install PM2: `npm install -g pm2` and PM2 log rotation: `pm2 install pm2-logrotate`
1. Edit config.hjson to configure your stuff

### Options for running
* Interactively: `node server.js` or `npm start`
* With PM2: `pm2 start` 
  * PM2 will ensure that Wheatyboy stays running, and will restart it if it fails
  * Logs to flour.log
  * Stop with `pm2 stop wheatyboy`
  * See status with `pm2 list`

### Installing as a service on Windows
https://www.npmjs.com/package/pm2-windows-service

Do all these in an elevated (Run as Administrator) window
1. Ensure that Wheatyboy is saved somewhere services can get to it (a folder directly under C:\ is probably ideal)
1. (Required if not already done) Globally install PM2: `npm install -g pm2` and PM2 log rotation: `pm2 install pm2-logrotate` 
1. `npm i pm2-windows-service -g` 
1. `pm2-service-install` and follow the prompts - be sure to give it a path for its home (eg `C:\pm2`) and I'd recommend specifying PM2_SERVICE_SCRIPTS - set that to the path to ecosystem.config.js
1. Ensure Wheatyboy is running in pm2 (`pm2 start`, `pm2 list`)
1. `pm2 save` - this will save the list of services that should be run
* If you want to disable, use `services.msc`


### Running at startup on Linux
https://pm2.keymetrics.io/docs/usage/startup/
1. (Required if not already done) Globally install PM2: `npm install -g pm2` and PM2 log rotation: `pm2 install pm2-logrotate` - as root
1. `pm2 startup` - as normal user
1. Copy/paste and run the command it gives you
1. Ensure Wheatyboy is running in pm2 (`pm2 start`, `pm2 list`)
1. `pm2 save` - this will save the list of services that should be run
* If you ever want to disable this, just `pm2 unstartup`
