const Bonjour = require('bonjour')
const Rx = require('rxjs')
const { mapObjIndexed, isNil, assoc, dissoc } = require('ramda')
const net = require('net')

module.exports = ServicesDriver

function ServicesDriver (actions, subjects) {
  const interval = 1000
  const multicast = {}
  const query = { type: 'opc' }

  const bonjour = Bonjour(multicast)
  const browser = bonjour.find(query)

  const timeout = setInterval(() => {
    browser.update()
  }, interval)

  browser.on('up', service => subjects.serviceUp$.next(service))
  browser.on('down', service => subjects.serviceDown$.next(service))

  // TODO change sockets into a stream
  const sockets = {}

  const services$ = Rx.Observable.merge(
    actions.up$.map(service => ({ action: 'up', service })),
    actions.down$.map(service => ({ action: 'down', service }))
  )
  .scan((sofar, message) => {
    const { action, service } = message
    const { fqdn } = service
    switch (action) {
      case 'up':
        return assoc(fqdn, service, sofar)
      case 'down':
        if (sockets[fqdn]) delete sockets[fqdn]
        return dissoc(fqdn, sofar)
      default:
        throw new Error('unexpected type ' + type)
    }
  }, {})
  .startWith({})
  .map(mapObjIndexed((service, key) => {
    var socket = sockets[key]
    if (isNil(socket)) {
      const { port, addresses } = service
      const address = addresses[0]
      
      socket = net.connect(port, address)
      socket.setNoDelay()
      socket.on('error', () => {
        subjects.up$.next(service)
      })
      socket.on('close', () => {
        subjects.down$.next(service)
      })
    }

    return assoc('socket', socket, service)
  }))

  return {
    services$
  }
}
