// TODO split this into separate module
//
// modular "framework" where each module exports
//
// - actions: action creators which push to action streams
// - driver: ({ ...action$ }) => ({ ...state$ })
//

const xs = require('xstream').default
const { pipe, keys, type, equals } = require('ramda')
const { Provider, connect } = require('xstream-connect')
const h = require('react-hyperscript')
const ReactDOM = require('react-dom')

const isFunction = pipe(type, equals('Function'))

module.exports = Resux

function Resux (Container, modules, mountNode) {
  var actions = {}
  var actionStreams = {}

  modules.forEach(module => {
    const { actions: actionCreators } = module

    // merge actions
    keys(actionCreators).forEach(actionName => {
      const actionCreator = actionCreators[actionName]
      if (!isFunction(actionCreator)) return
      const actionStream = xs.create()
      actionStreams[actionName + '$'] = actionStream
      actions[actionName] = (...args) => {
        const action = actionCreator(...args)
        actionStream.shamefullySendNext(action)
      }
    })
  })

  var store = {}

  modules.forEach(module => {
    const { driver } = module

    // merge state
    const driverState = driver(actionStreams, actions)
    keys(driverState).forEach(stateName => {
      const state$ = driverState[stateName]
      store[stateName] = state$.startWith(null)
    })
  })

  const ConnectedContainer = connect(
    state => keys(state).reduce((sofar, key) => {
      const keyWithoutDollar = key.substring(0, key.length - 1)
      return Object.assign(sofar, { [keyWithoutDollar]: state[key] })
    }, {})
  )(Container)

  ReactDOM.render(
    h(Provider, { store }, [
      h(ConnectedContainer, actions)
    ]),
    mountNode
  )
}
