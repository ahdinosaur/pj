const Bonjour = require('bonjour')
const { mapObjIndexed, isNil, assoc, dissoc } = require('ramda')
const net = require('net')

module.exports = PixelServicesStore

function PixelServicesStore (state, emitter) {
  const interval = 1000
  const multicast = {}
  const query = { type: 'opc' }

  const bonjour = Bonjour(multicast)
  const browser = bonjour.find(query)

  const timeout = setInterval(() => {
    browser.update()
  }, interval)

  const up = service => emitter.emit('pixelsUp', service)
  const down = service => emitter.emit('pixelsDown', service)

  browser.on('up', up)
  browser.on('down', down)

  emitter.on('pixelsUp', service => handleChange('up', service))
  emitter.on('pixelsDown', service => handleChange('down', service))

  const pixels = state.pixels = {}
  const sockets = state.sockets = {}

  function handleChange (type, service) {
    const { fqdn } = service
    switch (type) {
      case 'up':
        pixels[fqdn] = service
        sockets[fqdn] = startSocket(service)
        break
      case 'down':
        if (sockets[fqdn]) delete sockets[fqdn]
        delete pixels[fqdn]
        break
      default:
        throw new Error('unexpected type ' + type)
    }
    emitter.emit('render')
  }

  function startSocket (service) {
    const { port, addresses } = service
    const address = addresses[0]
    
    socket = net.connect(port, address)
    socket.setNoDelay()
    socket.on('error', () => {
      up(service)
    })
    socket.on('close', () => {
      down(service)
    })

    return socket
  }
}
