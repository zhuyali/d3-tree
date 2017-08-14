const path = require('path');

module.exports = {
  entry: {
    page: path.resolve(__dirname, './assets/page'),
    'd3-tree': path.resolve(__dirname, './lib/d3-tree')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
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
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};
