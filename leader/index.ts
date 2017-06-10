import xs, { Stream } from 'xstream'
import { run, Sources as RunSources } from '@cycle/run'
import { div, makeDOMDriver, DOMSource, VNode } from '@cycle/dom'
import isolate from '@cycle/isolate'
import onionify, { StateSource } from 'cycle-onionify'
const insertCss = require('insert-css')

import { Driver as ServicesDriver, Component as ServicesComponent, Sources as ServicesSources, State as ServicesState } from '../services'

export interface State {
  services: ServicesState
}
export type Reducer = (prev?: State) => State | undefined

export interface Sources {
  DOM: DOMSource
  onion: StateSource<State>
}

export interface Sinks {
  DOM: Stream<VNode>
  onion: Stream<Reducer>
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

  const vdom$ = xs.combine(
    state$,
    servicesSinks.DOM
  )
    .map(function ([state, servicesHtml]) {
      return div([
        /*
        label('Name:'),
        input('.myinput', {attrs: {type: 'text'}}),
        hr(),
        h1(`Hello ${name}`),
        */
        servicesHtml
      ])
    })
  
  /*
  const initReducer$ = xs.of(() => ({ name: '' }))
  const updateReducer$ = sources.DOM
    .select('.myinput').events('input')
    .map(ev => ev.target.value)
    .map(name => () => ({ name }))
  const servicesReducer$ = servicesSinks.onion
  const reducer$ = xs.merge(initReducer$, updateReducer$, servicesReducer$)
  */
  const reducer$ = //xs.merge(
    servicesSinks.onion
  //)

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

const main = onionify(Leader)

run(main, {
  services: ServicesDriver(),
  DOM: makeDOMDriver('#app')
} as RunSources)
/*
const React = require('react')
const h = require('react-hyperscript')
const { Provider: FelaProvider } = require('react-fela')
const PixelsGl = require('pixels-gl')
const { Surface } = require('gl-react-dom')

const Resux = require('../lib/resux')
const SceneList = require('../scenes/components/sceneList')
const Scene = require('../scenes/components/scene')
const Services = require('../services/component')
const modules = [
  require('../services'),
  require('../scenes'),
  require('../ipc'),
  require('../opc')
]

const renderer = createRenderer()
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

Resux(
  Container,
  modules,
  document.querySelector('#app')
)
*/
