const html = require('choo/html')
const Glsl = require('glslify')
const merge = require('ramda/src/merge')

module.exports = createRgb

function createRgb (rc, options) {
  const draw = rc.regl({
    frag: Glsl`
      precision highp float;
      varying vec2 uv;
      uniform float red;
      uniform float green;
      uniform float blue;
      void main() {
        vec3 rgb = vec3(red, green, blue);
        gl_FragColor = vec4(rgb, 1.0);
      }
    `,
    vert: Glsl`
      precision mediump float;
      attribute vec2 position;
      void main () {
        gl_Position = vec4(position, 0, 1);
      }
    `,
    attributes: {
      position: [
        -4, 4,
        4, 4,
        0, -4
      ]
    },
    uniforms: {
      red: rc.regl.prop('red'),
      green: rc.regl.prop('green'),
      blue: rc.regl.prop('blue')
    },
    count: 3
  })

  const clear = () => {
    rc.regl.clear({ color: [0,0,0,1], depth: true })
  }

  const defaults = {
    red: 0,
    green: 1,
    blue: 0
  }
  const props = (inputs) => {
    return merge(defaults, inputs)
  }


  const inputs = (values, emit) => {
    const input = (key) => {
      const value = values[key] == null
        ? defaults[key] : values[key]
      return html`
        <fieldset key='${key}'>
          <label>${key}</label>
          <input
            name='${key}'
            type='range'
            min="0"
            max="1"
            step="any"
            value=${value}
            oninput=${handleChange}
          />
        </fieldset>
      `

      function handleChange (ev) {
        const value = Number(ev.target.value)
        emit('setInput', { key, value })
      }
    }

    return html`
      <div>
        ${input('red')}
        ${input('green')}
        ${input('blue')}
      </div>
    `
  }

  return {
    clear,
    render: rc.render.bind(rc),
    draw,
    props,
    inputs
  }
}
