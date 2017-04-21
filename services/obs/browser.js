const Bonjour = require('bonjour')
const Rx = require('rxjs')

module.exports = ServicesBrowser

function ServicesBrowser (options) {
  const {
    interval = 1000,
    query = {},
    multicast = {}
  } = options

  const bonjour = Bonjour(multicast)

  const serviceBrower$ = Rx.Observable.create(observer => {
    const browser = bonjour.find(query)

    browser.on('up', up => next({ up }))
    browser.on('down', down => next({ down }))

    const timeout = setInterval(() => {
      console.log('update')
      browser.update()
    }, interval)

    return dispose

    function next ({ up, down }) {
      const { services } = browser
      observer.next({ services, up, down })
    }

    function dispose () {
      clearInterval(timeout)
    }
  })

  const services$ = serviceBrower$.map(o => o.services).startWith([])
  const up$ = serviceBrower$.map(o => o.up).filter(Boolean)
  const down$ = serviceBrower$.map(o => o.down).filter(Boolean)

  return { services$, up$, down$ }
}
