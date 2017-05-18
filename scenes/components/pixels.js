const React = require('react')
const h = require('react-hyperscript')
const PixelsGl = require('pixels-gl')
const { Surface } = require('gl-react-dom')

class Pixels extends React.Component {
  render () {
    const {
      width = 128,
      height = 128,
      pixels
    } = this.props

    return h('div', { className: 'scene' }, [
      h(Surface, {
        width,
        height
      }, [
        h(PixelsGl, { pixels })
      ])
    ])
  }
}

module.exports = Pixels
