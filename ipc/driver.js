const Rx = require('rxjs')
const { ipcRenderer } = require('electron')

const { propEq } = require('ramda')
module.exports = ipcDriver

const listenChannels = []

function ipcDriver ({ ipc$ }) {
  console.log('sub-ing ipc', ipc$)
  ipc$.subscribe(message => {
    console.log('ipc', message)
    const { channel, args = [] } = message
    ipcRenderer.send(channel, ...args)
  })

  const ipcOut$ = Rx.Observable.create(observer => {
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
    ipcOut$
  }
}
