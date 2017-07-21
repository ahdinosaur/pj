const html = require('choo/html')
const { pipe, map, values } = require('ramda')

const IpcView = require('../ipc/view')

module.exports = OpcView

function OpcView (state, emit) {
  // TODO filter state.services for opc
  return html`
    <div>
      ${IpcView(state, emit)}
      ${OpcServices(state.services)}
    </div>
  `
}

function OpcServices (opcServices) {
  return html`
    <ul>
      ${mapOpcServices(opcServices)}
    </ul>
  `
}

const mapOpcServices = pipe(map(OpcService), values)

function OpcService (opcService) {
  return html`
    <li>
      ${opcService.fqdn}
    </li>
  `
}
