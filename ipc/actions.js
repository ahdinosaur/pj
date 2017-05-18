const ipc = ({ channel, args = [] }) => ({
  channel,
  args
})

module.exports = {
  ipc
}
