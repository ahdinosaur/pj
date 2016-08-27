const serverRouter = require('server-router')
const summary = require('server-summary')
const browserify = require('browserify')
const logHttp = require('http-ndjson')
const bankai = require('bankai')
const bole = require('bole')
const http = require('http')
const path = require('path')
 
const clientp = path.join(__dirname, './client.js')
const log = bole('controller')

if (!process.module) {
  createServer({ port: 4000, logLevel: 'debug' })
}
 
function createServer (argv) {
  const router = createRouter()
  const server = http.createServer(function (req, res) {
    console.log('req.url', req.url)
    router(req, res).pipe(res)
  })
  server.listen(argv.port, summary(server))
}
 
function createRouter () {
  const router = serverRouter()
  router.on('', bankai.html())
  router.on('/bundle.css', bankai.css())
  router.on('/bundle.js', bankai.js(browserify, clientp))
  return router
}
