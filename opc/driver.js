const xs = require('xstream').default
const { propEq } = require('ramda')
const { encodePixels } = require('pixels-opc/codec')
const { encodePixelsMessage } = require('opc/codec')

const { SEND_OPC } = require('./actions')

module.exports = ipcDriver

const listenChannels = []

function ipcDriver ({ sendOpc$ }) {
  var opcSockets = {}

  sendOpc$.subscribe({
    next: sendOpc
  })

  return {
    opc$: xs.empty()
  }

  function sendOpc ({ services, pixels }) {
    const pixelsBuffer = encodePixels(pixels)
    sendOpcBuffer(services, pixelsBuffer)
  }

  function sendOpcBuffer (services, pixelsBuffer) {
    for (var key in services) {
      sendOpcBufferToService(services[key], pixelsBuffer)
    }
  }

  function sendOpcBufferToService (service, pixelsBuffer) {
    const { socket } = service
    const channel = 0
    const opcBuffer = encodePixelsMessage(channel, pixelsBuffer)
    socket.write(opcBuffer)
  }
}
