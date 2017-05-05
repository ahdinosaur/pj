const Rx = require('rxjs')
const { propEq } = require('ramda')
const net = require('net')
const { encodePixels } = require('pixels-opc/codec')
const { encodePixelsMessage } = require('opc/codec')

const { SEND_OPC } = require('./actions')

module.exports = ipcDriver

const listenChannels = []

function ipcDriver ({ sendOpc$ }) {
  var opcSockets = {}

  sendOpc$.subscribe(sendOpc)

  return {
    opc$: Rx.Observable.empty()
  }

  function sendOpc ({ services, pixels }) {
    // NOTE: check out this performance problem
    // if we throw an error here, it closes the observable
    // and everything becomes way faster. :3
    // throw new Error('hey')
    const pixelsBuffer = encodePixels(pixels)
    sendOpcBuffer(services, pixelsBuffer)
  }

  function sendOpcBuffer (services, pixelsBuffer) {
    for (var i = 0; i < services.length; i++) {
      sendOpcBufferToService(services[i], pixelsBuffer)
    }
  }

  function sendOpcBufferToService (service, pixelsBuffer) {
    const { host, port } = service
    const address = service.addresses[0]
    const serviceId = ServiceId(service)
    var opcSocket = opcSockets[serviceId]
    if (opcSocket == null) {
      const socket = net.connect(port, address)
      socket.setNoDelay()
      opcSocket = opcSockets[serviceId] = socket
    }
    const channel = 0
    const opcBuffer = encodePixelsMessage(channel, pixelsBuffer)
    opcSocket.write(opcBuffer)
  }
}

function ServiceId (service) {
  const { port } = service
  const address = service.addresses[0]
  return `${address}:${port}`
}
