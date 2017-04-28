const SET_SCENE = Symbol('setScene')

const setScene = ({ sceneId }) => ({
  type: SET_SCENE,
  sceneId
})

module.exports = {
  SET_SCENE,
  setScene
}
