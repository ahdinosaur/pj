const xs = require('xstream').default
const { ipcRenderer } = require('electron')

const { propEq } = require('ramda')

module.exports = ipcDriver

const listenChannels = []

function ipcDriver ({ ipc$ }) {
  ipc$.subscribe(message => {
    const { channel, args = [] } = message
    ipcRenderer.send(channel, ...args)
  })

  const ipcOut$ = xs.create({
    start: observer => {
      const listeners = listenChannels.map(channel => {
        const listener = (evt, ...args) => {
          observer.next({ channel, args })
        }
        ipcRenderer.on(channel, listener)
        return listener
      })
    },

    stop: () => {
      listenChannels.forEach((channel, index) => {
        const listener = listeners[index]
        ipcRenderer.removeListener(channel, listener)
      })
    }
  })

  return {
    ipcOut$
  }
}
