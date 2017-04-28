const Rx = require('rxjs')

module.exports = RainbowScene

RainbowScene.schema = {}

function RainbowScene (params$) {
  return params$
    .switchMap(params => {
      const { shape } = params

      const generator = rainbowPixels({ shape })
      const hslToRgb = convert('hsl', 'rgb')

      return Rx.Observable.generate(generator)
        .map(pixels => {
          const nextData = new Uint8Array(pixels.size)
          const nextPixels = Ndarray(nextData, pixels.shape, pixels.stride)
          return hslToRgb(pixels, nextPixels)
        })
    })
}
