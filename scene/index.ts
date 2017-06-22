import { Stream } from 'xstream'
import { DOMSource, VNode } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'

export { default as Component } from './component'

export interface Scene {
  name: string
}

export interface Scenes {
  [key: string]: Scene
}

export interface Param {
  type: string
  min: number
  max: number
  step: number
  value: number
}

export interface Params {
  [key: string]: Param
}

export type Value = any

export interface Values {
  [key: string]: Value
}

export interface State {
  scenes: Scenes
  sceneId: string
  params: Params
  values: Values

}

export type Reducer = (prev?: State) => State | undefined

export interface Sources {
  DOM: DOMSource
  onion: StateSource<State>
}

export interface Sinks {
  DOM: Stream<VNode>
  onion: Stream<Reducer>
  Regl: Stream<any>
}

export interface SetAction {
  type: 'SET'
  sceneId: string
};

export type Action = SetAction


