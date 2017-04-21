const React = require('react')
const ReactDOM = require('react-dom')
const { Subject, Observable } = require('rxjs')
const { Provider: FelaProvider } = require('react-fela')
const createContainer = require('rx-react-container').default
const h = require('react-hyperscript')
const { createRenderer } = require('fela')

const ServicesBrowser = require('../services/obs/browser')
const ipcDriver = require('../ipc/driver')

const { services$, up$, down$ } = ServicesBrowser({ query: { type: 'opc' } })

const createFollower$ = new Subject()

const renderer = createRenderer()
const mountNode = document.getElementById('app-styles')

const App = ({ services, createFollower }) => {
  return h(FelaProvider, { renderer, mountNode }, [
    h('div', [
      // show services
      h('div', JSON.stringify(services, null, 2)),
      // open new followerS
      h('button', { onClick: createFollower }, 'create follower!')
    ]),
  ])
}

const app$ = createContainer(App, { services$ }, { createFollower$ } )

app$.forEach(renderApp => {
  ReactDOM.render(
    renderApp(),
    document.querySelector('#app')
  )
})

const ipcMessageToMain$ = Observable
  .merge(
    createFollower$.map(() => ({ channel: 'create-follower' }))
  )

const ipcMessagesToRenderer$ = ipcDriver(ipcMessageToMain$)
