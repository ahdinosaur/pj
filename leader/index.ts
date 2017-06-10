import xs, { Stream } from 'xstream'
import { run, Sources as RunSources } from '@cycle/run'
import { div, makeDOMDriver, DOMSource, VNode } from '@cycle/dom'
import isolate from '@cycle/isolate'
import onionify, { StateSource } from 'cycle-onionify'
const insertCss = require('insert-css')

import {
  Driver as ServicesDriver,
  Component as ServicesComponent,
  Sources as ServicesSources,
  State as ServicesState
} from '../services'
import {
  Driver as IpcDriver,
  DriverSource as IpcDriverSource,
  DriverSink as IpcDriverSink,
  Component as IpcComponent,
  Sources as IpcSources,
  State as IpcState
} from '../ipc'

export interface State {
  services: ServicesState
  ipc: IpcState
}
export type Reducer = (prev?: State) => State | undefined

export interface Sources {
  DOM: DOMSource
  onion: StateSource<State>
  ipc: IpcDriverSink
}

export interface Sinks {
  DOM: Stream<VNode>
  onion: Stream<Reducer>
  ipc: IpcDriverSource
}

insertCss(`
   html, body, .main, canvas {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }      
`)

function Leader (sources: Sources): Sinks {
  const { state$ } = sources.onion
  const servicesSinks = isolate(ServicesComponent, 'services')(sources as any as ServicesSources)
  const ipcSinks = isolate(IpcComponent, 'ipc')(sources as any as IpcSources)

  const vdom$ = xs.combine(
    state$,
    servicesSinks.DOM,
    ipcSinks.DOM
  )
    .map(function ([state, servicesDom, ipcDom]) {
      return div([
        servicesDom,
        ipcDom
      ])
    })

  const reducer$ = xs.merge(
    servicesSinks.onion,
    ipcSinks.onion
  ) as Stream<Reducer>

  return {
    DOM: vdom$,
    onion: reducer$,
    ipc: ipcSinks.ipc
  }
}

const main = onionify(Leader)

run(main, {
  services: ServicesDriver(),
  ipc: IpcDriver(),
  DOM: makeDOMDriver('#app')
} as RunSources)

/*
const SceneList = require('../scenes/components/sceneList')
const Scene = require('../scenes/components/scene')
const Services = require('../services/component')
const modules = [
  require('../services'),
  require('../scenes'),
  require('../ipc'),
  require('../opc')
]

const mountNode = document.getElementById('app-styles')

const Container = ({ services, sceneList, setScene, currentSceneOutput, currentParamsForm, sendOpc, ipc }) => {
  return h(FelaProvider, { renderer, mountNode }, [
    h('div', { className: 'main' }, [
      // show services
      h(Services, { services }),
      // show scenes
      h(SceneList, { sceneList, setScene }),
      // show scene
      h(Scene, { scene: currentSceneOutput, paramsForm: currentParamsForm, send }),
      // open new followerS
      h('button', { className: 'follower', onClick: startFollower }, 'start follower!')
    ]),
  ])

  function send (pixels) {
    sendOpc({ pixels, services })
  }


  function startFollower ()  {
    ipc({ channel: 'start-follower' })
  }
}
*/
