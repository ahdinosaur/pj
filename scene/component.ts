import xs, { Stream } from 'xstream'
import { div, span, ul, li, button } from '@cycle/dom'
import { pipe, map, merge, assoc, prop, values } from 'ramda'
import { makeReglView } from 'cycle-regl'

import { Sources, Sinks, State, Reducer, SetAction, Scene, Scenes } from './'
import scenes from './scenes'

const fps = 60
const interval = 1000 / fps
const first = prop(0)
const name = prop('name')
const id = prop('id')

console.log(scenes)

function intent(domSource: DOMSource): Stream<Action> {
  // TODO use isolated child components?
  const action$ByScenes = map((scene): Scene => {
    return domSource.select('.play-' + id(scene))
      .events('click')
      .map(clickEv => {
        return {
          type: 'SET',
          sceneId: id(scene)
        } as SetAction
      })
  }, values(scenes))
  return xs.merge(...action$ByScenes)
}

function model(action$: Stream<Action>): Stream<Reducer> {
  const initReducer$ = xs.of(function initReducer(prev?: State): State {
    return {
      scenes,
      currentSceneId: id(first(values(scenes)))
    }
  })

  const setReducer$ = action$
    .filter(ac => ac.type === 'SET')
    .map((ac) => assoc('currentSceneId', ac.sceneId) as Reducer)

  return xs.merge(initReducer$, setReducer$)
}

const viewSceneItems = pipe(
  map(scene => {
    return li(button('.play-' + scene.id, scene.name))
  }),
  values
)

function view (state$: Stream<State>): Stream<VNode> {
  return state$.map(state => {
    console.log('view', state)
    return div([
      span('Current scene: ' + state.currentSceneId),
      ul(viewSceneItems(state.scenes))
    ])
  })
}

function play (tick$: Stream<any>, scene$: Stream<Scene>): Stream<any> {
  let currentScene
  function render (regl, context, commands, state) {
    return currentScene.render(regl, context, commands, state)
  }
  function commands (regl) {
    // merge all commands from all scenes into one object
    return merge(...map(scene => scene.commands(regl), values(scenes)))
  }
  const player = makeReglView(render, commands)
  return scene$.map(scene => {
    currentScene = scene
    const params$ = xs.of({})
    const props$ = scene.props({ tick$, params$ })
    const Regl$ = props$.map(player)
    return Regl$
  })
  .flatten()
}

export default function ServicesComponent (sources: Sources): Sinks {
  const { state$ } = sources.onion

  const currentScene$ = state$.map(state => {
    return scenes[state.currentSceneId]
  })

  const tick$ = xs.periodic(interval)
  const action$ = intent(sources.DOM)
  const reducer$ = model(action$)
  const vdom$ = view(state$)
  const Regl$ = play(tick$, currentScene$)

  return {
    DOM: vdom$,
    onion: reducer$,
    Regl$
  }
}
  /*
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
   */
