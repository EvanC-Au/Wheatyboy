var express = require("express");
var app = express();

var state = {

}

function init() {
    app.listen(3000, () => {
    console.log("INFO: API Server running. Port:",3000);
    });
}

module.exports = {
    init: init,
    state: state
}