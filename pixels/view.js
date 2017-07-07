const html = require('choo/html')
const { pipe, map, values } = require('ramda')

const IpcView = require('../ipc/view')

module.exports = PixelsView

function PixelsView (state, emit) {
  return html`
    <div>
      ${IpcView(state, emit)}
      ${PixelServices(state.pixels)}
    </div>
  `
}

function PixelServices (services) {
  return html`
    <ul>
      ${mapPixelServices(services)}
    </ul>
  `
}

const mapPixelServices = pipe(map(PixelService), values)

function PixelService (service) {
  return html`
    <li>
      ${service.fqdn}
    </li>
  `
}
