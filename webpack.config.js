const path = require('path');

module.exports = {
  entry: {
    page: path.resolve(__dirname, 'assets', 'page'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      d3: 'd3/build/d3.js'
    }
  },
};
