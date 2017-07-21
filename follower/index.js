const pull = require('pull-stream')
const toPull = require('stream-to-pull-stream')
const { createServer } = require('net')
const createOpcParser = require('pull-opc/decoder')
const Ndarray = require('ndarray')
const Bonjour = require('bonjour')
const getPort = require('getport')
const electron = require('electron')
const Regl = require('regl')
const PixelsGl = require('pixels-gl')
const insertCss = require('insert-css')
const createCid = require('cuid')

const globalConsole = electron.remote.getGlobal('console')

insertCss(`
   html, body, .main, canvas {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }      
`)

const regl = Regl()
const pixelsGl = PixelsGl(regl)


var pixels
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

  createServer(stream => {
    stream.setNoDelay()
    pull(
      toPull.source(stream),
      createOpcParser(),
      pull.map(message => {
        // message.channel
        // message.command
        var pixels = Ndarray(message.data, [64, 64, 3])
        pixels.format = 'rgb'
        return pixels
      }),
      pull.drain(nextPixels => {
        pixels = nextPixels
      })
    )
  }).listen(port, (err) => {
    if (err) globalConsole.error(err)
    else globalConsole.log('listening!')
  })
})

regl.frame(({ time }) => {
  pixelsGl({ pixels })
})
