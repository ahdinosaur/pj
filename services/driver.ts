const Bonjour = require('bonjour')
import xs, { Producer } from 'xstream'
const { assoc, dissoc } = require('ramda')
const net = require('net')
import { adapt } from '@cycle/run/lib/adapt';

import { DriverSource, DriverSink, Services, Service } from './'

export default function ServicesDriver () {
  const interval = 1000
  const multicast = {}
  const query = { type: 'opc' }
  const bonjour = Bonjour(multicast)

  return function driver (source: DriverSource): DriverSink {
    const sink = xs.createWithMemory({
      start: (listener) => {
        const browser = bonjour.find(query)
        this.timeout = setInterval(() => {
          browser.update()
        }, interval)

        var services = {}

        browser.on('up', (service: Service) => up(service))
        browser.on('down', (service: Service) => down(service))

        function up (service: Service) {
          const { fqdn, port, addresses } = service
          const address = addresses[0]
          
          var socket = net.connect(port, address)
          socket.setNoDelay()
          socket.on('error', () => { down(service) })
          socket.on('close', () => { down(service) })
          service.socket = socket

          services = assoc(fqdn, service, services)
          console.log('services', services)
          listener.next(services)
        }

        function down (service: Service) {
          const { fqdn } = service
          services = dissoc(fqdn, services)
          listener.next(services)
        }
      },

      stop: () => {
        this.timeout && this.timeout.unref && this.timeout.unref()
      },

      timeout: null
    } as Producer<Services>)

    return adapt(sink)
  }
}
