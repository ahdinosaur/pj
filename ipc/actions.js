const IPC = Symbol('IPC')

const ipc = ({ channel, args = [] }) => ({
  type: IPC,
  channel,
  args
})

module.exports = {
  IPC,
  ipc
}
