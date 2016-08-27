var createStore = require('redux').createStore
var ws = require('pull-ws-server')
var pull = require('pull-stream')
var pullStore = require('pull-redux')
var Jsondl = require('pull-json-doubleline')

function reducer (state, action) {
  return state
}
 
var store = createStore(reducer, {
  example: false
})

ws.createServer(function (stream) {
  pull(
    stream,
    Jsondl.parse(),
    pullStore(store),
    Jsondl.stringify(),
    stream
  )
}).listen(9999, function () {
  console.log("listening at ws://localhost:9999")
})
