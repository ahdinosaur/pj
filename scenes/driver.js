const { keys } = Object
const { Observable } = require('rxjs')

module.exports = ScenesDriver

const fps = 60
const interval = 1000 / fps

const scenes = {
  rainbow: require('./rainbow'),
  raindowGl: require('./rainbow-gl')
}
const sceneList = keys(scenes)

function ScenesDriver (actions) {
  const { setScene$ } = actions
  const tick$ = Observable.interval(interval)

  const sceneList$ = Observable.of(scenes)
  const currentSceneId$ = setScene$
    .map(action => action.sceneId)
    .startWith('rainbow')

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
