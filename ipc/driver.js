const Rx = require('rxjs')
const { ipcRenderer } = require('electron')
const { propEq } = require('ramda')

const { IPC } = require('./actions')

module.exports = ipcDriver

const listenChannels = []

function ipcDriver (action$) {
  const ipcMessage$ = action$
    .filter(propEq('type', IPC))

  ipcMessage$.subscribe(message => {
    const { channel, args = [] } = message
    ipcRenderer.send(channel, ...args)
  })

  const ipc$ = Rx.Observable.create(observer => {
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

  return {
    ipc$
  }
}
