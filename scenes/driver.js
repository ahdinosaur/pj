const { keys } = Object
const xs = require('xstream').default
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

function ScenesDriver ({ setScene$, setParams$ }, { setParams }) {
  const tick$ = xs.periodic(interval)

  const sceneList$ = xs.of(scenes)
  const currentScene$ = setScene$
    .startWith('rainbow')
    .map(sceneId => scenes[sceneId])
  const currentParams$ = currentScene$
    .map(scene => {
      return setParams$
        .startWith(scene.initialValues)
    })
    .flatten()
    .remember()
  const currentParamsForm$ = xs.combine(
      currentScene$,
      currentParams$
    )
    .map(([scene, params]) => {
      return h(Form, {
        schema: scene.schema,
        uiSchema: scene.uiSchema,
        formData: params,
        onChange: ({ formData: values }) => {
          setParams(values)
        }
      })
    })

  const currentSceneOutput$ = currentScene$
    .map(scene => {
      return scene({ params$: currentParams$, tick$ })
    })
    .flatten()

  return {
    sceneList$,
    currentParamsForm$,
    currentSceneOutput$
  }
}
