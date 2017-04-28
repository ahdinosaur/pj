const IPC = Symbol('IPC')

const ipc = ({ channel, args = [] }) => ({
  type: IPC,
  channel,
  args
})

const startFollower = () => ipc({
  channel: 'start-follower'
})

module.exports = {
  IPC,
  ipc,
  startFollower
}
