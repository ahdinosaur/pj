const UP = Symbol('up')
const DOWN = Symbol('down')

function up (service) {
  return { type: UP, service }
}

function down (service) {
  return { type: DOWN, service }
}

module.exports = {
  UP,
  DOWN,
  serviceUp: up,
  serviceDown: down
}
