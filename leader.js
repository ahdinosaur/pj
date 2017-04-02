const net = require('net')
const pull = require('pull-stream')
const rainbowPixels = require('rainbow-pixels')
const pixelsToOpc = require('pixels-opc')
const connect = require('pull-net/client')
const delay = require('pull-delay')
const convert = require('ndpixels-convert')
const Bonjour = require('bonjour')

const bonjour = Bonjour()

bonjour.find({ type: 'opc' }, (service) => {
  console.log('found service', service)

  sendPixels(service)
})

function sendPixels (options, cb) {
  const {
    port,
    host = 'localhost',
    channel
  } = options
  //const client = connect()
  connect({ port, host }, (err, stream) => {
    if (err) return console.error(err)

    pull(
      pull.infinite(rainbowPixels({
        shape: [10]
      })),
      pull.map(convert('hsl', 'rgb')),
      pixelsToOpc(channel),
      delay(100),
      stream,
      pull.drain(null, err => {
        if (err) throw err
      })
    )
  })
}
