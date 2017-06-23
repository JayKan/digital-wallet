'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const NoEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = function(options) {
  return webpackMerge(commonConfig(options), {
    devtool: 'source-map',
    entry: {
      main: './src/main.aot.ts',
    },
    output: {
      filename: '[name].[chunkhash].js',
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: 'src/favicon.ico', to: '' }
      ]),
      new ExtractTextPlugin('styles.[chunkhash].css'),
      new NoEmitOnErrorsPlugin(),
      new OptimizeJsPlugin({
        sourceMap: false
      }),
      new WebpackMd5Hash(),
      new UglifyJsPlugin({
        beautify: false,
        output: {
          comments: false
        },
        mangle: {
          screw_ie8: true  // eslint-disable-line camelcase
        },
        compress: {
          screw_ie8: true, // eslint-disable-line camelcase
          dead_code: true, // eslint-disable-line camelcase
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          negate_iife: false // we need this for lazy v8
        }
      })
    ]
  });
};
