var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './server.js',
  // entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'server_build.js'
  },
  module: {
    rules: [

    ]
  },
  target: 'node',
  resolve: {
    extensions: ['.js']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
}

