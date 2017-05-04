const Rx = require('rxjs')
const { propEq } = require('ramda')
const net = require('net')
const { encodePixels } = require('pixels-opc/codec')
const { encodePixelsMessage } = require('opc/codec')

const { SEND_OPC } = require('./actions')

module.exports = ipcDriver

const listenChannels = []

function ipcDriver (action$) {
  const sendOpc$ = action$
    .filter(propEq('type', SEND_OPC))

  var opcSockets = {}

  sendOpc$.subscribe(sendOpc)

  return {
    opc$: Rx.Observable.empty()
  }

  function sendOpc (message) {
    const { services, pixels } = message
    services.forEach(service => {
      const { host, port } = service
      const address = service.addresses[0]
      const serviceId = ServiceId(service)
      const opcSocket = opcSockets[serviceId]
      if (opcSocket == null) {
        const socket = net.connect(port, address)
        socket.setNoDelay()
        opcSockets[serviceId] = socket
        sendOpc(message)
      } else {
        const channel = 0
        const pixelsBuffer = encodePixels(pixels)
        const opcBuffer = encodePixelsMessage(channel, pixelsBuffer)
        opcSocket.write(opcBuffer)
      }
    })
  }
}

function ServiceId (service) {
  const { port } = service
  const address = service.addresses[0]
  return `${address}:${port}`
}
