const Glsl = require('glslify')
const { merge } = require('ramda')

exports.props = props
exports.render = render
exports.commands = commands
exports.id = 'rainbow'
exports.name = 'Rainbow Scene'
exports.params = []

function props ({ params$, tick$ }) {
  return params$
    .map(params => {
      const numSteps = 72

      return tick$
        .fold((sofar, next) => {
          const step = 1 / numSteps
          return (sofar + step) % 1
        }, 0)
        .map((start) => {
          return merge(params, { start })
        })
    })
    .flatten()
}

function render (regl, context, commands, props) {
  const { rainbow } = commands

  regl.clear({
    color: [0, 0, 0, 0],
    depth: 1
  })

  rainbow(props)
}

function commands (regl) {
  const rainbow = regl({
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
      start: regl.prop('start')
    },
    count: 3
  })

  return {
    rainbow
  }
}
