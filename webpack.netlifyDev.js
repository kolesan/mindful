const merge = require('webpack-merge');
const dev = require('./webpack.dev.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(dev, {
    plugins: [
      new CopyWebpackPlugin([
        '_redirects'
      ])
    ]
  }
);