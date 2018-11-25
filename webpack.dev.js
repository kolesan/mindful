const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    entry: ['./src/dev/DevTools.js'],
    devServer: {
      contentBase: './dist',
      historyApiFallback: true
    },
    mode: 'development'
  }
);