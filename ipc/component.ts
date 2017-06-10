import xs  from 'xstream'
import { div, button } from '@cycle/dom'

import { Sources, Sinks, State, Message } from './'

export default function IpcComponent (sources: Sources): Sinks {
  const { state$ } = sources.onion

  const vdom$ = state$.map(() =>
    div([
      button('.start-follower', 'start follower!')
    ])
  )

  const message$ = sources.DOM
    .select('.start-follower').events('click')
    .map(clickEv => {
      return {
        channel: 'start-follower',
        args: []
      } as Message
    })

  const reducer$ = xs.of(function initReducer (prev?: State): State {
    return {}
  })

  return {
    DOM: vdom$,
    onion: reducer$,
    ipc: message$
  }
}
