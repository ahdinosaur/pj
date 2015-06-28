var http = require('http')
var ecstatic = require('ecstatic')

var config = require('config')

var server = http.createServer(function (req, res) {
  if (req.url === '/') {
    require('ui')(config.ui)(req, res)
  } else if (req.url === '/api') {
    require('api')(config.api)(req, res)
  } else {
    ecstatic(config.ecstatic)(req, res)
  }
})
