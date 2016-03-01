var createStore = require('redux').createStore
var ws = require('pull-ws-server')
var pull = require('pull-stream')
var pullStore = require('pull-redux')

function reducer (action, state) {
  if (action.type === 'example') {
    return { example: true }
  }
  return state
}
 
var store = createStore(reducer, {
  example: false
})

// TODO remote redux actions over pull streams
//  i.e. separate pull-action from pull-redux
// TODO affect store, publish state to subscribers
//  i.e. separate pull-store from pull-redux
//
//  or...
//
//  tickable redux is synchronous
//    i.e. emit tick, then read
//  which means it is rpc, each action call receives
//  the state after the action has been dispatched

ws.createServer(function (stream) {
  pull(
    stream,
    pull.map(JSON.parse),
    pullStore(store),
    pull.map(JSON.stringify),
    stream
  )
}).listen(9999, function () {
  console.log("listening at ws://localhost:9999")
})

/*

function Between (a, b) {
  return t.refinement(
    t.Number,
    (a) => n >= a && n <= b,
    'Between (inclusive)'
  )
}

var Color = t.enums({
  
})


//
input actions ->

view(controller(model, action))


view(reducer(state, action))

-> display pixels
//

view(reducer(state, action))

store.on('*', function (action, state, oldState) {
  // view state as pixels
  var pixels = view(state)
  // write pixels
  write(pixels)
})

function view (state) {

}

function write (pixels) {

}
*/
