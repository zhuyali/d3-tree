const path = require('path');

module.exports = {
  entry: {
    page: path.resolve(__dirname, './assets/page'),
    'd3-tree': path.resolve(__dirname, './lib/d3-tree')
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build',
    filename: '[name].js'
  },
  externals: [
    {
    }
  ],
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.json$/,
        loader: 'json',
        exclude: /node_modules/
      },
      {
        test: /\.js[x]?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'latest'],
            plugins: []
          }
        }
      }
    ]
  }
};
