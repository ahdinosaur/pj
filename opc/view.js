const html = require('choo/html')
const { pipe, map, values } = require('ramda')

const IpcView = require('../ipc/view')

module.exports = OpcView

function OpcView (state, emit) {
  return html`
    <div>
      ${IpcView(state, emit)}
      ${OpcServices(state.services)}
    </div>
  `
}

function OpcServices (services) {
  return html`
    <ul>
      ${mapOpcServices(services)}
    </ul>
  `
}

const mapOpcServices = pipe(map(OpcService), values)

function OpcService (service) {
  return html`
    <li>
      ${service.fqdn}
    </li>
  `
}
