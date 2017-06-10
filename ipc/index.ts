import { Stream } from 'xstream'
import { DOMSource, VNode } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'

export { default as Driver } from './driver'
export { default as Component } from './component'

export interface Message {
  channel: string,
  args: Array<any>
}

export interface State {}
export type Reducer = (prev?: State) => State | undefined

export type DriverSource = Stream<Message>
export type DriverSink = Stream<Message>

export interface Sources {
  DOM: DOMSource
  onion: StateSource<State>
  ipc: DriverSink
}

export interface Sinks {
  DOM: Stream<VNode>
  onion: Stream<Reducer>
  ipc: DriverSource
}
