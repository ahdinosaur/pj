const SET_SCENE = Symbol('setScene')

const setScene = (sceneId) => ({
  type: SET_SCENE,
  sceneId
})

const setParams = (params) => params

module.exports = {
  SET_SCENE,
  setScene,
  setParams
}
