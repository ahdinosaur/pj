import { ipcRenderer } from 'electron'
import xs, { Producer } from 'xstream'
import { adapt } from '@cycle/run/lib/adapt'

import { DriverSource, DriverSink, Message } from './'

const listenChannels = [] as Array<string>

export default function IpcDriver () {
  return function driver (source: DriverSource): DriverSink {
    source.addListener({
      next (message) {
        const { channel, args = [] } = message
        ipcRenderer.send(channel, ...args)
      },
      error () {},
      complete () {}
    })

    const sink = xs.create({
      start (observer) {
        this.listeners = listenChannels.map(channel => {
          const listener = (evt: any, ...args: Array<any>) => {
            observer.next({ channel, args } as Message)
          }
          ipcRenderer.on(channel, listener)
          return listener
        })
      },

      stop () {
        listenChannels.forEach((channel, index) => {
          const listener = this.listeners[index]
          ipcRenderer.removeListener(channel, listener)
        })
      },

      listeners: null
    } as Producer<Message>)

    return adapt(sink)
  }
}
