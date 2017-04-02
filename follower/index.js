const pull = require('pull-stream')
const createServer = require('pull-net/server')
const createOpcParser = require('pull-opc/decoder')
const Ndarray = require('ndarray')
const Bonjour = require('bonjour')
const getPort = require('getport')
const toCanvas = require('pixels-canvas')

getPort((err, port) => {
  if (err) throw err

  console.log('port', port)

  const bonjour = Bonjour()
  const bonjourService = {
    name: 'pj',
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
    pull(
      stream.source,
      createOpcParser(),
      pull.map(message => {
        // message.channel
        // message.command
        var pixels = Ndarray(message.data, [10, 3])
        pixels.format = 'rgb'
        return pixels
      }),
      pull.drain(pixelsToCanvas)
    )
  }).listen(port, (err) => {
    if (err) console.error(err)
  })

})
