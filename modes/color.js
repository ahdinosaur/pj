var t = require('tcomb')

function Between (a, b) {
  return t.refinement(
    t.Number,
    (a) => n >= a && n <= b,
    'Between (inclusive)'
  )
}

var hsl = t.struct({
  hue: Between(0, 360),
  saturation: Between(0, 100),
  lightness: Between(0, 100)
})

var Color = t.enums({
  hsl
})

function toColor

module.exports
