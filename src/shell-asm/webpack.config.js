const path = require('path');
const tsconfigPathsWebpackPlugin = require('./.webpack/tsconfig-paths-webpack-plugin');
const svgInlineLoaderRule = require('./.webpack/svg-inline-loader-rule');
const tsLoaderRule = require('./.webpack/ts-loader-rule');
const sourceMapLoaderRule = require('./.webpack/source-map-loader-rule');
const cssLoaderRule = require('./.webpack/css-loader-rule');
const scssLoaderRule = require('./.webpack/scss-loader-rule');
const miniCssExtractPlugin = require('./.webpack/mini-css-extract-plugin');
const base64InlinerLoaderRule = require('./.webpack/base64-inline-loader-rule');
const htmlWebpackPlugin = require('./.webpack/html-webpack-plugin');
const hmrPlugin = require('./.webpack/hmr-plugin');


module.exports = {
  mode: 'development',
  entry: {
    app: [
      './src/index.tsx',
      'webpack-hot-middleware/client'
    ],
    vendor: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name].bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css', '.scss', '.svg'],
    plugins: [
      tsconfigPathsWebpackPlugin
    ]
  },
  module: {
    rules: [
      svgInlineLoaderRule,
      tsLoaderRule,
      sourceMapLoaderRule,
      cssLoaderRule,
      scssLoaderRule,
      base64InlinerLoaderRule
    ]
  },
  plugins: [
    htmlWebpackPlugin,
    hmrPlugin,
    miniCssExtractPlugin
  ]
};