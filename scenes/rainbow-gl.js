const h = require('react-hyperscript')
const { Shaders, Node, GLSL } = require('gl-react')
const Rx = require('rxjs')
const rainbowPixels = require('rainbow-pixels')
const convert = require('ndpixels-convert')
const Ndarray = require('ndarray')
const { merge } = require('ramda')

module.exports = RainbowScene

RainbowScene.schema = {}

function RainbowScene ({ params$, tick$ }) {
  return params$
    .switchMap(params => {
      const numSteps = 72

      return tick$
        .scan((sofar, next) => {
          const step = 1 / numSteps
          return (sofar + step) % 1
        })
        .map((start) => {
          const props = merge(params, { start })
          return h(Rainbow, props)
        })
    })
}

const shaders = Shaders.create({
  rainbow: {
    frag: GLSL`

precision highp float;

// from https://github.com/Jam3/glsl-hsl2rgb/blob/master/index.glsl
// TODO use glslify
float hue2rgb(float f1, float f2, float hue) {
  if (hue < 0.0)
      hue += 1.0;
  else if (hue > 1.0)
      hue -= 1.0;
  float res;
  if ((6.0 * hue) < 1.0)
    res = f1 + (f2 - f1) * 6.0 * hue;
  else if ((2.0 * hue) < 1.0)
    res = f2;
  else if ((3.0 * hue) < 2.0)
    res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
  else
    res = f1;
  return res;
}

vec3 hsl2rgb(vec3 hsl) {
  vec3 rgb;
  
  if (hsl.y == 0.0) {
    rgb = vec3(hsl.z); // Luminance
  } else {
    float f2;
    
    if (hsl.z < 0.5)
      f2 = hsl.z * (1.0 + hsl.y);
    else
      f2 = hsl.z + hsl.y - hsl.y * hsl.z;
        
    float f1 = 2.0 * hsl.z - f2;
    
    rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
    rgb.g = hue2rgb(f1, f2, hsl.x);
    rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
  }   
  return rgb;
}

vec3 hsl2rgb(float h, float s, float l) {
  return hsl2rgb(vec3(h, s, l));
}

varying vec2 uv;

uniform float start;

void main() {
  float x = mod(start + uv.x, 1.0);
  vec3 rgb = hsl2rgb(x, 1.0, 0.5);
  gl_FragColor = vec4(rgb, 1.0);
}
    `
  }
})


function Rainbow (props) {
  const { start } = props
  const { rainbow: shader } = shaders

  return h(Node, {
    shader,
    uniforms: {
      start
    }
  })
}