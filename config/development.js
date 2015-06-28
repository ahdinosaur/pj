module.exports = {
  api: {
    rainbow: {
      shape: [16, 16],
      inc: 1
    },
    fps: 120,
    url: {
      protocol: 'ws',
      host: 'localhost',
      port: '3000'
    }
  },
  ui: {
    element: 'main',
    url: {
      protocol: 'http',
      host: 'localhost',
      port: '3000'
    },
    net: {
      port: 7890,
      host: '192.168.7.2'
    }
  },
  ecstatic: {
    root: __dirname + '/../src'
  }
}
