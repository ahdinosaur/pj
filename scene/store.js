const { keys } = Object
const rcom = require('regl-component')(require('regl'))
const raf = require('nanoraf')

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
    console.log('inputs', state.inputs, key, value)
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
}

function getScene (name) {
  const scene = scenes[name](rcom.create())
  return function (inputs) {
    scene.clear()
    scene.draw(scene.props(inputs))
    return scene
  }
}
