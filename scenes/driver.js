const { keys } = Object
const { Observable } = require('rxjs')
const { default: Form } = require('react-jsonschema-form')
const h = require('react-hyperscript')

module.exports = ScenesDriver

const fps = 60
const interval = 1000 / fps

const scenes = {
  rainbow: require('./rainbow'),
  rgb: require('./rgb')
}
const sceneList = keys(scenes)

function ScenesDriver ({ setScene$, setParams$ }) {
  const tick$ = Observable.interval(interval)

  const sceneList$ = Observable.of(scenes)
  const currentScene$ = setScene$
    .startWith('rainbow')
    .map(sceneId => scenes[sceneId])
    //.share()
    //.publishReplay(1)
  const currentParams$ = currentScene$.switchMap(scene => {
    return setParams$
      .startWith(scene.initialValues)
  })
  const currentParamsForm$ = Observable.combineLatest(
    currentScene$,
    currentParams$
  )
    .map(([scene, params]) => {
      return h(Form, {
        schema: scene.schema,
        uiSchema: scene.uiSchema,
        formData: params,
        onChange: ({ formData: values }) => {
          setParams$.next(values)
        }
      })
    })

  const currentSceneOutput$ = currentScene$.switchMap(scene => {
    return scene({ params$: currentParams$, tick$ })
  })

  return {
    sceneList$,
    currentParamsForm$,
    currentSceneOutput$
  }
}
