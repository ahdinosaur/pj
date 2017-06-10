import xs from 'xstream'
import { ul, li } from '@cycle/dom'
import { map, values } from 'ramda'

import { Sources, Sinks, State, Reducer, Services, Service, ServiceList } from './'

export default function ServicesComponent (sources: Sources): Sinks {
  const { state$ } = sources.onion
  const services$ = sources.services

  const initReducer$ = xs.of(function initReducer (): State {
    return { serviceList: [] }
  })
  const updateReducer$ = services$
    .map(function (services: Services): Reducer {
      return function updateReducer (prevState: State): State {
        return {
          serviceList: values(services) as ServiceList
        }
      }
    })
  const reducer$ = xs.merge(initReducer$, updateReducer$)

  const vdom$ = state$
    .map((state: State) => {
      const { serviceList } = state
      const serviceItems = renderServiceItems(serviceList)
      return ul({}, serviceItems)
    })

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

const renderServiceItems = map(renderServiceItem)

function renderServiceItem (service: Service) {
  return li({}, service.fqdn)
}
