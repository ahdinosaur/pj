const pull = require('pull-stream')
const toPull = require('stream-to-pull-stream')
const { createServer } = require('net')
const createOpcParser = require('pull-opc/decoder')
const Ndarray = require('ndarray')
const Bonjour = require('bonjour')
const getPort = require('getport')
//const toCanvas = require('pixels-canvas')
const electron = require('electron')

const React = require('react')
const { render } = require('react-dom')
const h = require('react-hyperscript')
const PixelsGl = require('pixels-gl')
const { Surface } = require('gl-react-dom')
const insertCss = require('insert-css')
const createCid = require('cuid')

const Scene = require('../scenes/component')

insertCss(`
   html, body, .main, canvas {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }      
`)

const globalConsole = electron.remote.getGlobal('console')

getPort((err, port) => {
  if (err) throw err

  globalConsole.log('port', port)

  const cid = createCid()
  const bonjour = Bonjour()
  const bonjourService = {
    name: 'pj-' + cid,
    port,
    type: 'opc',
    protocol: 'tcp'
  }
  
  // TODO broadcast shape in data field
  // shape: [
  //   Math.floor(document.body.clientWidth / 16),
  //    Math.floor(document.body.clientHeight / 16)
  //  ]
  //
  // TODO broadcast color spaces

  bonjour.publish(bonjourService)

  var canvas = document.createElement('canvas')
  document.body.style = document.documentElement.style = canvas.style = 'padding: 0; margin: 0; height: 100%; width: 100%'
  canvas.height = document.body.clientHeight
  canvas.width = document.body.clientWidth
  document.body.appendChild(canvas)

  const pixelsToCanvas = toCanvas(canvas)

  createServer(stream => {
    stream.setNoDelay()
    pull(
      toPull.source(stream),
      createOpcParser(),
      pull.map(message => {
        // message.channel
        // message.command
        var pixels = Ndarray(message.data, [128, 128, 3])
        pixels.format = 'rgb'
        return pixels
      }),
      pull.drain(pixelsToCanvas)
    )
  }).listen(port, (err) => {
    if (err) globalConsole.error(err)
    else globalConsole.log('listening!')
  })
})

function toCanvas (canvas) {
  const app = document.querySelector('#app')
  return pixels => {
    return render(
      h(Scene, { pixels }),
      app
    )
  }
}
