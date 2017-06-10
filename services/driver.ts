const Bonjour = require('bonjour')
import xs, { Stream, Producer } from 'xstream'
const { mapObjIndexed, isNil, assoc, dissoc } = require('ramda')
const net = require('net')
import { adapt } from '@cycle/run/lib/adapt';

import { Services, DriverSource, DriverSink } from './'

export default function ServicesDriver () {
  const interval = 1000
  const multicast = {}
  const query = { type: 'opc' }
  const bonjour = Bonjour(multicast)

  return function driver (source: DriverSource): DriverSink {
    const sink = xs.createWithMemory({
      start: (listener) => {
        const browser = bonjour.find(query)
        const timeout = setInterval(() => {
          browser.update()
        }, interval)

        var services = {}

        browser.on('up', service => up(service))
        browser.on('down', service => down(service))

        function up (service) {
          const { fqdn, port, addresses } = service
          const address = addresses[0]
          
          var socket = net.connect(port, address)
          socket.setNoDelay()
          socket.on('error', () => { down(service) })
          socket.on('close', () => { down(service) })
          service.socket = socket

          services = assoc(fqdn, service, services)
          listener.next(services)
        }

        function down (service) {
          const { fqdn } = service
          services = dissoc(fqdn, services)
          listener.next(services)
        }
      }
    } as Producer<Services>)

    return adapt(sink)
  }
}
