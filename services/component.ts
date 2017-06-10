import xs from 'xstream'
import { ul, li } from '@cycle/dom'
import { map, values } from 'ramda'

import { Sources, Sinks, State, Reducer, Services, Service, ServiceList } from './'

export default function ServicesComponent (sources: Sources): Sinks {
  const { state$ } = sources.onion
  const services$ = sources.services
  console.log('services sources', services$)

  const initReducer$ = xs.of(function initReducer (): State {
    return { serviceList: [] }
  })
  const updateReducer$ = services$
    .mapTo(function (services: Services): Reducer {
      console.log('services', services)
      return function updateReducer (prevState: State): State {
        console.log('prevState', prevState)
        return {
          serviceList: values(services) as ServiceList
        }
      }
    })
  const reducer$ = xs.merge(initReducer$, updateReducer$)

  const vdom$ = state$
    .map((state: State) => {
      const { serviceList } = state
      console.log('serviceList', serviceList)
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
