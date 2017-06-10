import xs, { Stream } from 'xstream'
import { h, DOMSource, VNode } from '@cycle/dom'
import { StateSource } from 'cycle-onionify'
import { map, values } from 'ramda'

import { Sources, Sinks, State, Service, ServiceList } from './'

export default function ServicesComponent (sources: Sources): Sinks {
  const { state$ } = sources.onion
  const services$ = sources.services

  const initReducer$ = xs.of(function initReducer (prev?: State): State {
    return { serviceList: [] }
  })
  const updateReducer$ = services$
    .mapTo((services) => function updateReducer (prevState: State): State {
      return { serviceList: values(services) as ServiceList }
    })
  const reducer$ = xs.merge(initReducer$, updateReducer$)

  const vdom$ = state$
    .map(({ serviceList }) => {
      const serviceItems = renderServiceItems(serviceList)
      return h('ul', {}, serviceItems)
    })

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

const renderServiceItems = map(renderServiceItem)

function renderServiceItem (service: Service) {
  return h('li', {}, service.fqdn)
}
