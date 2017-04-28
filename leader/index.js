const h = require('react-hyperscript')
const { createRenderer } = require('fela')
const { Provider: FelaProvider } = require('react-fela')

const Resux = require('../lib/resux')

const services = require('../services')
//const scenes = require('../scenes')
const ipc = require('../ipc')

const modules = [
  services,
//  scenes,
  ipc
]

const renderer = createRenderer()
const mountNode = document.getElementById('app-styles')

const Container = ({ services, sceneList, startFollower }) => {
  return h(FelaProvider, { renderer, mountNode }, [
    h('div', [
      // show services
      h('div', JSON.stringify(services, null, 2)),
      // show scenes
//      h('div', JSON.stringify(sceneList, null, 2)),
      // open new followerS
      h('button', { onClick: startFollower }, 'start follower!')
    ]),
  ])
}

Resux(
  Container,
  modules,
  document.querySelector('#app')
)
