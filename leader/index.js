const xs = require('xstream').default
const { run } = require('@cycle/run')
const { div, label, input, hr, h1 } = require('@cycle/dom')
const { makeFelaDomDriver, createComponent } = require('cycle-fela')
const insertCss = require('insert-css')
const onionify = require('cycle-onionify').default

insertCss(`
   html, body, .main, canvas {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }      
`)

const Container = createComponent(() => ({}))

function Leader (sources) {
  const { state$ } = sources.onion

  const vdom$ = state$
    .map(({ name }) => {
      return Container([
        label('Name:'),
        input('.myinput', {attrs: {type: 'text'}}),
        hr(),
        h1(`Hello ${name}`)
      ])
    })
  
  const initReducer$ = xs.of(() => ({ name: '' }))
  const updateReducer$ = sources.DOM
    .select('.myinput').events('input')
    .map(ev => ev.target.value)
    .map(name => () => ({ name }))
  const reducer$ = xs.merge(initReducer$, updateReducer$)

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

run(onionify(Leader), {
  DOM: makeFelaDomDriver('#app', {
    customStyleNode: document.querySelector('#app-styles')
  })
})
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
