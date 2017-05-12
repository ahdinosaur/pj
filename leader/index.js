const React = require('react')
const h = require('react-hyperscript')
const { createRenderer } = require('fela')
const { Provider: FelaProvider } = require('react-fela')
const PixelsGl = require('pixels-gl')
const { Surface } = require('gl-react-dom')
const insertCss = require('insert-css')

insertCss(`
   html, body, .main, canvas {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }      
`)

const Resux = require('../lib/resux')
const Scene = require('../scenes/component')
const Services = require('../services/component')
const modules = [
  require('../services'),
  require('../scenes'),
  require('../ipc'),
  require('../opc')
]

const renderer = createRenderer()
const mountNode = document.getElementById('app-styles')

const Container = ({ services, sceneList, currentScene, sendOpc, ipc }) => {
  return h(FelaProvider, { renderer, mountNode }, [
    h('div', { className: 'main' }, [
      // show services
      h(Services, { services }),
      // show scenes
      h('div', { className: 'scenes' }, JSON.stringify(sceneList, null, 2)),
      // show scene
      h(Scene, { pixels: currentScene, send }),
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
