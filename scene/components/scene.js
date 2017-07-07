const React = require('react')
const h = require('react-hyperscript')
const { Surface } = require('gl-react-dom')

function SceneContainer (props) {
  if (props.scene == null) return null
  else return h(Scene, props)
}

class Scene extends React.Component {
  componentDidUpdate () {
    const { send, scene } = this.props
    if (send) {
      const pixels = this.refs.surface.capture()
      this.props.send(pixels)
    }
  }

  render () {
    const {
      width = 128,
      height = 128,
      scene,
      params,
      paramsForm
    } = this.props

    return h('div', { className: 'scene' }, [
      h(Surface, {
        ref: 'surface',
        width,
        height,
        webglContextAttributes: { preserveDrawingBuffer: true }
      }, [
        scene
      ]),
      paramsForm
    ])
  }
}

module.exports = SceneContainer
