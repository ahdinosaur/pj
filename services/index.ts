import { Stream } from 'xstream'
import { DOMSource, VNode } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'

export { default as Driver } from './driver'
export { default as Component } from './component'

export interface Service {
  fqdn: string
  port: number
  addresses: Array<string>
  socket: any
}

export interface Services {
  [key: string]: Service
}

export type ServiceList = Array<Service>

export interface State {
  serviceList: Array<Service>
}

export type Reducer = (prev?: State) => State | undefined

export type DriverSource = undefined
export type DriverSink = Stream<Services>

export interface Sources {
  DOM: DOMSource
  onion: StateSource<State>
  services: DriverSink
}

export interface Sinks {
  DOM: Stream<VNode>
  onion: Stream<Reducer>
}

export interface UpAction {
  type: 'UP'
  service: Service
};

export interface DownAction {
  type: 'DOWN'
  service: Service
}

export type Action = UpAction | DownAction


