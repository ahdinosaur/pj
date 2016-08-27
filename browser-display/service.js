const serverRouter = require('server-router')
const summary = require('server-summary')
const browserify = require('browserify')
const pullHttp = require('pull-http')
const logHttp = require('http-ndjson')
const pull = require('pull-stream')
const bankai = require('bankai')
const bole = require('bole')
const http = require('http')
const path = require('path')
 
const clientp = path.join(__dirname, 'view-browser.js')
const log = bole('render-http')

if (!process.module) {
  createServer({ port: 4000, logLevel: 'debug' })
}
 
function createServer (argv) {
  bole.output({ level: argv.logLevel, stream: process.stdout })
  const router = createRouter()
  const server = http.createServer(function (req, res) {
    const setSize = logHttp(req, res, log.debug)
    const source = pullHttp.createSource(req, res)
    const through = router(req, res, setSize)
    const sink = pullHttp.createSink(req, res, setSize)
    pull(source, through, sink)
  })
  server.listen(argv.port, summary(server))
}
 
function createRouter () {
  const router = serverRouter('/404')
  router.on('/', pullHttp.intercept(bankai.html()))
  router.on('/bundle.css', pullHttp.intercept(bankai.css()))
  router.on('/bundle.js', pullHttp.intercept(bankai.js(browserify, clientp)))
  return router
}
