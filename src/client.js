var websocket = require('websocket-stream')

var config = require('config')

websocket(require('api')(config.api))
.pipe(require('ui')(config.ui))
