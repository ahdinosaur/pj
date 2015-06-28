var http = require('http')
var websocket = require('websocket-stream')
var ecstatic = require('ecstatic')

var config = require('config')

var httpServer = http.createServer(
  ecstatic(config.ecstatic)
)

var api = require('api')(httpServer, config.api)
var ui = require('ui')(config.ui)

require('api/handler')(ui)
