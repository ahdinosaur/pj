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
  var actions = {}

  modules.forEach(module => {
    const { actions: actionCreators } = module

    // merge actions
    keys(actionCreators).forEach(actionName => {
      const actionCreator = actionCreators[actionName]
      if (!isFunction(actionCreator)) return
      actions[actionName + '$'] = ActionSubject(actionCreator)
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

  const app$ = createContainer(Container, state, actions)

  app$.forEach(renderApp => {
    ReactDOM.render(
      renderApp(),
      mountNode
    )
  })
}

function ActionSubject (actionCreator) {
  var subject = new Subject()
  const next = subject.next.bind(subject)
  subject.next = (value) => {
    next(actionCreator(value))
  }
  return subject
}

/*
class ActionSubject extends Subject {
  constructor (actionCreator) {
    super()
    this.actionCreator = actionCreator
    this.superNext = Subject.prototype.next.bind(this)
  }
  next (value) {
    this.superNext(this.actionCreator(value))
  }
}
*/
