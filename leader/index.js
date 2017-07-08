const App = require('choo')
const Log = require('choo-log')
const html = require('choo/html')
const PixelsGl = require('pixels-gl')
const insertCss = require('insert-css')

insertCss(`
   html, body, main, canvas {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }      
`)

var app = App()
app.use(Log())
app.use(require('../ipc/store'))
app.use(require('../service/store'))
app.use(require('../opc/store'))
app.use(require('../scene/store'))
app.route('#/', LayoutView(require('../opc/view')))
app.route('#/:name', LayoutView(require('../scene/view')))
app.mount('main')

function LayoutView (MainView) {
  return (state, emit) => {
    return html`
      <main>
        <h1>Pixel Jockey</h1>
        <nav>
          <a href='#/'>pixels</a>
          ${state.scenes.map(name => html`
            <a href='#/${name}'>${name}</a>
          `)}
        </nav>
        ${MainView(state, emit)}
      </main>
    `
  }
}
