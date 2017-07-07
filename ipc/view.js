const html = require('choo/html')

module.exports = IpcView

function IpcView (state, emit) {
  return html`
    <button onclick=${startFollower}>
      start follower
    </button>
  `

  function startFollower (ev) {
    emit('sendIpc', { channel: 'start-follower' })
  }
}
