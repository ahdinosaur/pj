const Rx = require('rxjs')
const { propEq } = require('ramda')
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
