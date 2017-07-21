const { keys } = Object
const rcom = require('regl-component')(
  require('regl'),
  {
    attributes: {
      preserveDrawingBuffer: true
    }
  }
)
const raf = require('nanoraf')
const Ndarray = require('ndarray')

module.exports = SceneStore

var scenes = {
  rainbow: require('./regl/rainbow'),
  rgb: require('./regl/rgb')
}

const fps = 2
const interval = 1000 / fps

function SceneStore (state, emitter) {
  state.rcom = rcom
  state.scenes = keys(scenes)

  reset()
  emitter.on('navigate', reset)

  emitter.on('setInput', ({ key, value }) => {
    state.inputs[key] = value
    emitter.emit('render')
  })

  const tick = raf(() => {
    process.nextTick(tick)
    if (!state.params) return
    if (!state.scene) {
      const { name } = state.params
      if (!name) return
      state.scene = getScene(name)
    }
    emitter.emit('render')
  })
  tick()

  function reset () {
    state.scene = null
    state.inputs = {}
  }

  function getScene (name) {
    const rc = rcom.create()
    const scene = scenes[name](rc)
    return function (inputs) {
      scene.clear()
      scene.draw(scene.props(state.inputs))
      const rect = rc.element.getBoundingClientRect()
      const x = rect.left
      const y = window.innerHeight - rect.bottom
      const width = rect.right - rect.left
      const height = rect.bottom - rect.top
      var data = state.pixelsBuffer
      data = rc.regl.read({ x, y, width, height, data })
      state.pixelsBuffer = data
      if (data == null) return scene
      state.pixels = Ndarray(
        data,
        [width, height, 4]
      )
      state.pixels.format = 'rgba'
      return scene
    }
  }
}

