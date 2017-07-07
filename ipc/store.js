const { ipcRenderer } = require('electron')

module.exports = IpcStore

const listenChannels = []

function IpcStore (state, emitter) {
  emitter.on('sendIpc', (message) => {
    const { channel, args = [] } = message
    ipcRenderer.send(channel, ...args)
  })

  listenChannels.map(channel => {
    const listener = (evt, ...args) => {
      emitter.emit('recvIpc', { channel, args })
    }
    ipcRenderer.on(channel, listener)
    return listener
  })
}
