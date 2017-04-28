const React = require('react')
const ReactDOM = require('react-dom')
const { Subject, Observable } = require('rxjs')
const { Provider: FelaProvider } = require('react-fela')
const createContainer = require('rx-react-container').default
const h = require('react-hyperscript')
const { createRenderer } = require('fela')

// TODO standard "framework" where each module exports
//
// - actions: which are then wrapped with Rx.Subject as input streams
// - driver: (action$) => ({ ...state$ })
//

const servicesDriver = require('../services/driver')
const scenesDriver = require('../scenes/driver')
const ipcDriver = require('../ipc/driver')

const servicesOptions$ = Observable.of({ query: { type: 'opc' } })
const { services$, up$, down$ } = servicesDriver(servicesOptions$)

const setScene$ = new Subject()
const sceneAction$ = Observable.merge(
  setScene$.map(sceneId => ({ type: 'scenes:set', sceneId }))
)
const { sceneList$, currentScene$ } = scenesDriver(sceneAction$)

const createFollower$ = new Subject()
const ipcMessageToMain$ = Observable.merge(
  createFollower$.map(action => ({ channel: 'create-follower' }))
)
const ipcMessagesToRenderer$ = ipcDriver(ipcMessageToMain$)

// ---

console.log('sceneList', sceneList$)

const renderer = createRenderer()
const mountNode = document.getElementById('app-styles')

const App = ({ services, sceneList, createFollower }) => {
  return h(FelaProvider, { renderer, mountNode }, [
    h('div', [
      // show services
      h('div', JSON.stringify(services, null, 2)),
      // show scenes
      h('div', JSON.stringify(sceneList, null, 2)),
      // open new followerS
      h('button', { onClick: createFollower }, 'create follower!')
    ]),
  ])
}

const app$ = createContainer(App, { services$, sceneList$ }, { createFollower$ } )

app$.forEach(renderApp => {
  ReactDOM.render(
    renderApp(),
    document.querySelector('#app')
  )
})
