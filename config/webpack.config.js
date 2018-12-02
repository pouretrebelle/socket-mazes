'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => ({
  devtool: 'eval-source-map',
  entry: './src/client/main.js',
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.pug',
      inject: 'body',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.pug?$/,
        use: [
          'html-loader',
          {
            loader: 'pug-html-loader',
            options: {
              data: {
                mode: argv.mode,
              },
            },
          },
        ],
      },
      {
        test: /\.s[ca]ss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    alias: {
      styles: path.resolve('src', 'styles'),
    },
  },
});
