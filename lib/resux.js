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
  const action$ = new Subject()

  var state = {}
  var subjects = {}

  modules.forEach(module => {
    const { actions, driver } = module

    // merge actions
    keys(actions).forEach(actionName => {
      const actionCreator = actions[actionName]
      if (!isFunction(actionCreator)) return
      const subject = new Subject()
      subject.forEach(value => {
        action$.next(actionCreator(value))
      })
      subjects[actionName + '$'] = subject
    })

    // merge state
    const driverState = driver(action$)
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
