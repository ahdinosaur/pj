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

const modules = [
  require('../services'),
  require('../scenes'),
  require('../ipc'),
  require('../opc')
]

const renderer = createRenderer()
const mountNode = document.getElementById('app-styles')

const Container = ({ services, sceneList, currentScene, sendOpc, startFollower }) => {
  return h(FelaProvider, { renderer, mountNode }, [
    h('div', { className: 'main' }, [
      // show services
      h('div', { className: 'services' }, JSON.stringify(services, null, 2)),
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
}

class Scene extends React.Component {
  componentDidUpdate () {
    const pixels = this.refs.surface.capture()
    this.props.send(pixels)
  }

  render () {
    const {
      width = 64,
      height = 64,
      pixels
    } = this.props

    return h('div', { className: 'scene' }, [
      h(Surface, {
        ref: 'surface',
        width,
        height,
        webglContextAttributes: { preserveDrawingBuffer: true }
      }, [
        h(PixelsGl, { pixels })
      ])
    ])
  }
}

Resux(
  Container,
  modules,
  document.querySelector('#app')
)
