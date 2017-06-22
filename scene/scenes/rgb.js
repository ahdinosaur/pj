const Glsl = require('glslify')
const { default: xs } = require('xstream')

exports.props = props
exports.render = render
exports.commands = commands
exports.id = 'rgb'
exports.name = 'RGB Scene'
exports.params = [
  {
    name: 'red',
    type: 'number',
    value: 0,
    minimum: 0,
    maximum: 1,
    step: 0.01
  },
  {
    name: 'green',
    type: 'number',
    value: 1,
    minimum: 0,
    maximum: 1,
    step: 0.01
  },
  {
    name: 'blue',
    type: 'number',
    value: 0,
    minimum: 0,
    maximum: 1,
    step: 0.01
  }
]

function props ({ params$, tick$ }) {
  return xs.of(exports.initialValues)
}

function render (regl, context, commands, props) {
  const { rgb } = commands

  regl.clear({
    color: [0, 0, 0, 0],
    depth: 1
  })

  rgb(props)
}

function commands (regl) {
  const rgb = regl({
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
      red: regl.prop('red'),
      green: regl.prop('green'),
      blue: regl.prop('blue')
    },
    count: 3
  })

  return {
    rgb
  }
}
