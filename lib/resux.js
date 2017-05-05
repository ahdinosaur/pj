// TODO split this into separate module
//
// standard "framework" where each module exports
//
// - actions: which are then wrapped with Rx.Subject as input streams
// - driver: (action$) => ({ ...state$ })
//
//
const { Subject, Observable } = require('rxjs')
const { pipe, keys, type, equals } = require('ramda')
const createContainer = require('rx-react-container').default
const ReactDOM = require('react-dom')

const isFunction = pipe(type, equals('Function'))

module.exports = Resux

function Resux (Container, modules, mountNode) {
  var subjects = {}
  var actions = {}

  modules.forEach(module => {
    const { actions: actionCreators } = module

    // merge actions
    keys(actionCreators).forEach(actionName => {
      const actionCreator = actionCreators[actionName]
      if (!isFunction(actionCreator)) return
      const subject = new Subject()
      subjects[actionName + '$'] = subject
      actions[actionName + '$'] = subject.map(actionCreator)
    })
  })

  var state = {}

  modules.forEach(module => {
    const { driver } = module

    // merge state
    const driverState = driver(actions)
    keys(driverState).forEach(stateName => {
      const state$ = driverState[stateName]
      state[stateName] = state$.startWith(null)
    })
  })

  const app$ = createContainer(Container, state, subjects)

  app$.forEach(renderApp => {
    ReactDOM.render(
      renderApp(),
      mountNode
    )
  })
}
