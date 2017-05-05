const React = require('react')
const h = require('react-hyperscript')
const PixelsGl = require('pixels-gl')
const { Surface } = require('gl-react-dom')

class Scene extends React.Component {
  componentDidUpdate () {
    const { send, surface } = this.props
    if (send) {
      const pixels = this.refs.surface.capture()
      this.props.send(pixels)
    }
  }

  render () {
    const {
      width = 128,
      height = 128,
      pixels
    } = this.props

    return h('div', { className: 'scene' }, [
      h(Surface, {
        ref: 'surface',
        width,
        height,
        webglContextAttributes: { preserveDrawingBuffer: true }
      }, [
        h(PixelsGl, { pixels })
      ])
    ])
  }
}

module.exports = Scene
