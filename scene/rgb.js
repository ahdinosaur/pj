const h = require('react-hyperscript')
const { Shaders, Node, GLSL } = require('gl-react')
const xs = require('xstream')
const Ndarray = require('ndarray')
const { merge } = require('ramda')

module.exports = RgbScene

RgbScene.schema = {
  type: 'object',
  properties: {
    red: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      multipleOf: 0.01
    },
    green: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      multipleOf: 0.01
    },
    blue: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      multipleOf: 0.01
    }
  }
}

RgbScene.uiSchema = {
  red: {
    'ui:widget': 'range'
  },
  green: {
    'ui:widget': 'range'
  },
  blue: {
    'ui:widget': 'range'
  }
}

RgbScene.initialValues = {
  red: 1,
  green: 0,
  blue: 0
}

function RgbScene ({ params$, tick$ }) {
  return params$
    .map(params => tick$
      .map((start) => h(Rgb, params))
    )
    .flatten()
}

const shaders = Shaders.create({
  rgb: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform float red;
uniform float green;
uniform float blue;

void main() {
  vec3 rgb = vec3(red, green, blue);
  gl_FragColor = vec4(rgb, 1.0);
}
    `
  }
})


function Rgb (props) {
  return h(Node, {
    shader: shaders.rgb,
    uniforms: props
  })
}
