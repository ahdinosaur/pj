const Bonjour = require('bonjour')
const Rx = require('rxjs')
const { mapObjIndexed, isNil, assoc, dissoc } = require('ramda')
const net = require('net')

const { UP, DOWN } = require('./actions')

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
    actions.serviceUp$, actions.serviceDown$
  )
  .scan((sofar, action) => {
    const { type, service } = action
    const { fqdn } = service
    switch (type) {
      case UP:
        return assoc(fqdn, service, sofar)
      case DOWN:
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
        subjects.serviceDown$.next(service)
      })
      socket.on('close', () => {
        subjects.serviceDown$.next(service)
      })
    }

    return assoc('socket', socket, service)
  }))

  return {
    services$
  }
}
