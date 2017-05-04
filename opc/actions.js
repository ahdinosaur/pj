const SEND_OPC = Symbol('SEND_OPC')

const sendOpc = ({ pixels, services }) => ({
  type: SEND_OPC,
  pixels,
  services
})

module.exports = {
  SEND_OPC,
  sendOpc
}
