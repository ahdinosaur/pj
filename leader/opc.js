const { assign } = Object
const net = require('net')
const pull = require('pull-stream')
const rainbowPixels = require('rainbow-pixels')
const pixelsToOpc = require('pixels-opc')
const connect = require('pull-net/client')
const delay = require('pull-delay')
const convert = require('ndpixels-convert')

const Bonjour = require('../lib/obs-bonjour')

module.exports = opcLeader

function opcLeader (options, cb) {
  Bonjour(
    { type: 'opc' },
    sendPixels(options),
    cb
  )
}

function sendPixels (options) {
  return function pixelSender (service, cb) {
    const {
      port,
      host = 'localhost',
      channel
    } = service

    connect({ port, host }, (err, stream) => {
      if (err) return cb(err)

      pull(
        pull.infinite(rainbowPixels({
          shape: [10]
        })),
        pull.map(convert('hsl', 'rgb')),
        pixelsToOpc(channel),
        delay(100),
        stream,
        pull.drain(null, cb)
      )
    })
  }
}
