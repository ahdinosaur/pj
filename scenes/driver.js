const { keys } = Object
const { Observable } = require('rxjs')

module.exports = ScenesDriver

const fps = 60
const interval = 1000 / fps

const scenes = {
  rainbow: require('./rainbow')
}
const sceneList = keys(scenes)

function ScenesDriver () {
  const tick$ = Observable.interval(interval)

  const sceneList$ = Observable.of(sceneList)
  const currentSceneId$ = Observable.of(sceneList[0])
  const currentScene$ = currentSceneId$.switchMap(sceneId => {
    const params$ = Observable.of({
      shape: [128, 128]
    })
    const scene = scenes[sceneId]({ params$, tick$ })

    return scene
  })

  return {
    sceneList$,
    currentSceneId$,
    currentScene$
  }
}
