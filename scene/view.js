const html = require('choo/html')

module.exports = SceneView

function SceneView (state, emit) {
  if (!state.scene) return
  const scene = state.scene(state.inputs)

  return html`
    <div>
      ${state.rcom.render()}
      <h2>${state.params.name}</h2>
      ${scene.render({ width: 800, height: 400 })}
      ${scene.inputs && scene.inputs(state.inputs, emit)}
    </div>
  `
}
