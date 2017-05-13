const h = require('react-hyperscript')
const { pipe, mapObjIndexed, values } = require('ramda')

module.exports = SceneList

function SceneList (props) {
  const { sceneList, setScene } = props

  const mapScenes = pipe(
    mapObjIndexed((scene, sceneId) => {
      return Scene({ sceneId, setScene })
    }),
    values
  )

  return h('ul', mapScenes(sceneList))
}


function Scene (props) {
  const { sceneId, setScene } = props

  return h('li', [
    h('button', { onClick: handleClick }, [sceneId])
  ])

  function handleClick (ev) {
    setScene(sceneId)
  }
}

