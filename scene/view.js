const html = require('choo/html')

module.exports = SceneView

function SceneView (state, emit) {
  if (!state.scene) return
  const scene = state.scene()

  return html`
    <div>
      ${state.rcom.render()}
      <h2>${state.params.name}</h2>
      ${scene.render({ width: 4, height: 4 })}
      ${scene.inputs && scene.inputs(state.inputs, emit)}
    </div>
  `
}
