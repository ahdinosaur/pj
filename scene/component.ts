import xs, { Stream } from 'xstream'
import { div, span, ul, li, button, input } from '@cycle/dom'
import { pipe, map, merge, assoc, prop, values } from 'ramda'
import { makeReglView } from 'cycle-regl'

import { Sources, Sinks, State, Reducer, SetAction, Scene, Param } from './'
import scenes from './scenes'

const fps = 60
const interval = 1000 / fps
const first = prop(0)
const name = prop('name')
const id = prop('id')
const params = prop('params')

console.log(scenes)
const scenesParams = map(params, scenes)

function intent (domSource: DOMSource): Stream<Action> {
  // TODO use isolated child components?
  const action$ByScenes = map((scene): Scene => {
    const playAction$ = domSource.select('.play-' + id(scene))
      .events('click')
      .map(clickEv => {
        return {
          type: 'PLAY',
          sceneId: id(scene)
        } as SetAction
      })
    const action$ByParams = map((param): Param => {
      const editAction$ = domSource.select('.edit-' + id(param))
        .events('input')
        .map(clickEv => {
          return {
            type: 'EDIT',
            sceneId: id(scene),
            paramId: id(param),
            value: clickEv.target.value
          } as EditAction
        })
    }, values(scene.params))
    return xs.merge(playAction$, action$ByParams)
  }, values(scenes))
  return xs.merge(...action$ByScenes)
}

function model(action$: Stream<Action>): Stream<Reducer> {
  const initReducer$ = xs.of(function initReducer(prev?: State): State {
    return {
      scenes,
      sceneId: id(first(values(scenes)))
    }
  })

  const playReducer$ = action$
    .filter(ac => ac.type === 'PLAY')
    .map((ac) => assoc('sceneId', ac.sceneId) as Reducer)

  const editReducer$ = action$
    .filter(ac => ac.type === 'EDIT')
    .map((ac) => pipe(
      assoc('value'),
      assoc(ac.sceneId),
      assoc(ac.paramId)
    ) as Reducer)

  return xs.merge(initReducer$, playReducer$, editReducer$)
}

const viewSceneItems = pipe(
  map(scene => {
    return button('.play-' + scene.id, scene.name)
  }),
  map(li),
  values,
  ul
)

const viewSceneParams = pipe(
  map(param => {
    let options = {
      attrs: {}
    }
    if (param.type === 'number') {
      Object.assign(options.attrs, param)
    }
    return input('.edit-' + param.id, options, param.name)
  }),
  map(li),
  values,
  ul
)

function view (state$: Stream<State>): Stream<VNode> {
  return state$.map(({ sceneId, scenes }) => {
    const scene = scenes[sceneId]
    const { id, params } = scene
    return div([
      div([
        span('Current scene: ' + id),
        viewSceneItems(scenes)
      ]),
      viewSceneParams(params)
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
    return scenes[state.sceneId]
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
