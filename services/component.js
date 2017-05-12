const h = require('react-hyperscript')
const { pipe, map, values } = require('ramda')

module.exports = Services

function Services (props) {
  const { services } = props
  return h('ul', {}, mapServices(services))
}

const mapServices = pipe(map(Service), values)

function Service (service) {
  return h('li', {}, service.fqdn)
}
