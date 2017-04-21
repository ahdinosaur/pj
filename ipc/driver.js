const Rx = require('rxjs')
const { ipcRenderer } = require('electron')

module.exports = ipcDriver

const listenChannels = []

function ipcDriver (ipcMessage$) {
  ipcMessage$.subscribe(message => {
    const { channel, args = [] } = message
      console.log('sending!', channel, ...args)
    ipcRenderer.send(channel, ...args)
  })

  return Rx.Observable.create(observer => {
    const listeners = listenChannels.map(channel => {
      const listener = (evt, ...args) => {
        observer.next({ channel, args })
      }
      ipcRenderer.on(channel, listener)
      return listener
    })

    return () => {
      channels.forEach((channel, index) => {
        const listener = listeners[index]
        ipcRenderer.removeListener(channel, listener)
      })
    }
  })
}
