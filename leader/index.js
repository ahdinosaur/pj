const React = require('react')
const ReactDOM = require('react-dom')
const { Subject, Observable } = require('rxjs')
const { Provider: FelaProvider } = require('react-fela')
const createContainer = require('rx-react-container').default
const h = require('react-hyperscript')
const { createRenderer } = require('fela')
const { pipe, type, equals, forEachObjIndexed, mapObjIndexed, filter, assoc } = require('ramda')

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

const isFunction = pipe(type, equals('Function'))

App(
  Container,
  modules,
  document.querySelector('#app')
)

// TODO split this into separate module
//
// standard "framework" where each module exports
//
// - actions: which are then wrapped with Rx.Subject as input streams
// - driver: (action$) => ({ ...state$ })
//

function App (Container, modules, mountNode) {
  const action$ = new Subject()
  var state = {}
  var subjects = {}

  const mergeActions = forEachActionCreator((actionCreator, name) => {
    const subject = new Subject()
    subject.forEach(value => {
      action$.next(actionCreator(value))
    })
    subjects = assoc(name + '$', subject, subjects)
  })
  const mergeState = driver => {
    forEachObjIndexed((state$, name) => {
      const safeState$ = state$.startWith(null)
      state = assoc(name, safeState$, state)
    }, driver(action$))
  }

  modules.forEach(module => {
    const { actions, driver } = module
    mergeActions(actions)
    mergeState(driver)
  })

  const app$ = createContainer(Container, state, subjects)

  app$.forEach(renderApp => {
    ReactDOM.render(
      renderApp(),
      mountNode
    )
  })
}

function forEachActionCreator (cb) {
  return pipe(filter(isFunction), mapObjIndexed(cb))
}
