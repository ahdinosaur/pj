const html = require('choo/html')
const Glsl = require('glslify')

module.exports = createRainbow

function createRainbow (rc, options) {
  const draw = rc.regl({
    frag: Glsl`
      precision highp float;
      #pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
      uniform float start;
      varying vec2 uv;
      void main() {
        float x = mod(start + uv.x, 1.0);
        vec3 rgb = hsl2rgb(x, 1.0, 0.5);
        gl_FragColor = vec4(rgb, 1.0);
      }
    `,
    vert: Glsl`
      precision mediump float;
      attribute vec2 position;
      varying vec2 uv;
      void main () {
        uv = 0.5 * (1.0 + position);
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
      start: rc.regl.prop('start')
    },
    count: 3
  })

  const clear = () => {
    rc.regl.clear({ color: [0,0,0,1], depth: true })
  }

  const numSteps = 72
  const step = 1 / numSteps
  var sofar = 0
  const props = (inputs) => {
    sofar = (sofar + step) % 1
    return {
      start: sofar
    }
  }

  return {
    clear,
    render: rc.render.bind(rc),
    draw,
    props
  }
}
