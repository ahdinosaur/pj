const Bonjour = require('bonjour')
const { mapObjIndexed, isNil, assoc, dissoc } = require('ramda')
const net = require('net')
const { encodePixels } = require('pixels-opc/codec')
const { encodePixelsMessage } = require('opc/codec')

module.exports = OpcStore

function OpcStore (state, emitter) {
  const up = service => emitter.emit('serviceUp', service)
  const down = service => emitter.emit('serviceDown', service)

  emitter.on('serviceUp', service => {
    service.socket = startSocket(service)
  })

  function startSocket (service) {
    const { port, addresses } = service
    const address = addresses[0]
    
    socket = net.connect(port, address)
    socket.setNoDelay()
    socket.on('error', () => {
      emitter.emit('serviceDown', service)
    })
    socket.on('close', () => {
      emitter.emit('serviceDown', service)
    })

    return socket
  }

  emitter.on('render', render)

  function render () {
    const { services, pixels } = state
    if (pixels == null) return
    emitter.emit('sendOpc', { services, pixels })
  }

  emitter.on('sendOpc', sendOpc)

  function sendOpc ({ services, pixels }) {
    const pixelBuffer = encodePixels(pixels)
    sendOpcBuffer(services, pixelBuffer)
  }

  function sendOpcBuffer (services, pixelBuffer) {
    for (var key in services) {
      sendOpcBufferToService(services[key], pixelBuffer)
    }
  }

  function sendOpcBufferToService (service, pixelBuffer) {
    const { socket } = service
    if (!socket) return
    const channel = 0
    const opcBuffer = encodePixelsMessage(channel, pixelBuffer)
    socket.write(opcBuffer)
  }
}
