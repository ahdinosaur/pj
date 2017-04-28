const { keys } = Object
const { Observable } = require('rxjs')

module.exports = ScenesDriver

const scenes = {
  rainbow: require('./rainbow')
}
const sceneList = keys(scenes)

function ScenesDriver (action$) {
  const sceneList$ = Observable.of(sceneList)
  const currentSceneId$ = Observable.of(sceneList[0])

  const currentScene$ = currentSceneId$.switchMap(sceneId => {
    const params$ = Observable.of({
      shape: [128, 128]
    })
    const scene = scenes[sceneId](params$)
    console.log('scene', scene)
    return scene
  })

  return {
    sceneList$,
    currentSceneId$,
    currentScene$
  }
}
