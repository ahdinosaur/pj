const Bonjour = require('bonjour')
const { mapObjIndexed, isNil, assoc, dissoc } = require('ramda')
const net = require('net')

module.exports = OpcStore

function OpcStore (state, emitter) {
  const interval = 1000
  const multicast = {}
  const query = { type: 'opc' } // TODO generalize

  const bonjour = Bonjour(multicast)
  const browser = bonjour.find(query)

  const timeout = setInterval(() => {
    browser.update()
  }, interval)

  const up = service => emitter.emit('serviceUp', service)
  const down = service => emitter.emit('serviceDown', service)

  browser.on('up', up)
  browser.on('down', down)

  emitter.on('serviceUp', service => handleChange('up', service))
  emitter.on('serviceDown', service => handleChange('down', service))

  const services = state.services = {}

  function handleChange (type, service) {
    const { fqdn } = service
    switch (type) {
      case 'up':
        services[fqdn] = service
        break
      case 'down':
        delete services[fqdn]
        break
      default:
        throw new Error('unexpected type ' + type)
    }
    emitter.emit('render')
  }
}
