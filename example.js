
var pull = require('pull-stream')
var rainbow = require('rainbow-pixels')
var raf = require('pull-raf')
var WebSocket = require('ws')
var convert = require('ndpixels-convert')

var ws = new WebSocket('ws://localhost:1337')
 
ws.on('open', function open () {
  pull(
    rainbow({
      shape: [2 * 60],
      saturation: 100,
      lightness: 90
    }),
    raf(),
    pull.map(convert('hsl', 'rgb')),
    pull.drain(pixels => {
      var data = Uint8Array.from(pixels.data)
      var buffer = Buffer(data.buffer)
      ws.send(buffer, { binary: true })
    })
  )
})
