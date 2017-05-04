const Rx = require('rxjs')
const rainbowPixels = require('rainbow-pixels')
const convert = require('ndpixels-convert')
const Ndarray = require('ndarray')

module.exports = RainbowScene

RainbowScene.schema = {}

function RainbowScene ({ params$, tick$ }) {
  return params$
    .switchMap(params => {
      const { shape } = params

      const generator = rainbowPixels({ shape })
      const hslToRgb = convert('hsl', 'rgb')

      return tick$
        .map(generator)
        .map(pixels => {
          var nextData = new Uint8Array(pixels.size)
          var nextPixels = Ndarray(nextData, pixels.shape, pixels.stride)
          hslToRgb(pixels, nextPixels)
          return nextPixels
        })
    })
}
