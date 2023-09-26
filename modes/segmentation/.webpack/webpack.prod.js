// const path = require('path');
// const pkg = require('../package.json');

// const outputFile = 'index.umd.js';
// const rootDir = path.resolve(__dirname, '../');
// const outputFolder = path.join(__dirname, `../dist/umd/${pkg.name}/`);

// Todo: add ESM build for the mode in addition to umd build
// const config = {
//   mode: 'production',
//   entry: rootDir + '/' + pkg.module,
//   devtool: 'source-map',
//   output: {
//     path: outputFolder,
//     filename: outputFile,
//     library: pkg.name,
//     libraryTarget: 'umd',
//     chunkFilename: '[name].chunk.js',
//     umdNamedDefine: true,
//     globalObject: "typeof self !== 'undefined' ? self : this",
//   },
//   externals: [
//     {
//       react: {
//         root: 'React',
//         commonjs2: 'react',
//         commonjs: 'react',
//         amd: 'react',
//       },
//       '@ohif/core': {
//         commonjs2: '@ohif/core',
//         commonjs: '@ohif/core',
//         amd: '@ohif/core',
//         root: '@ohif/core',
//       },
//       '@ohif/ui': {
//         commonjs2: '@ohif/ui',
//         commonjs: '@ohif/ui',
//         amd: '@ohif/ui',
//         root: '@ohif/ui',
//       },
//     },
//   ],
//   module: {
//     rules: [
//       {
//         test: /(\.jsx|\.js|\.tsx|\.ts)$/,
//         loader: 'babel-loader',
//         exclude: /(node_modules|bower_components)/,
//         resolve: {
//           extensions: ['.js', '.jsx', '.ts', '.tsx'],
//         },
//       },
//     ],
//   },
//   resolve: {
//     modules: [path.resolve('./node_modules'), path.resolve('./src')],
//     extensions: ['.json', '.js', '.jsx', '.tsx', '.ts'],
//   },
// };

// module.exports = config;
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pkg = require('./../package.json');
const webpackCommon = require('./../../../.webpack/webpack.base.js');

const ROOT_DIR = path.join(__dirname, './../');
const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');
const ENTRY = {
  app: `${SRC_DIR}/index.tsx`,
};

module.exports = (env, argv) => {
  const commonConfig = webpackCommon(env, argv, { SRC_DIR, DIST_DIR, ENTRY });

  return merge(commonConfig, {
    stats: {
      colors: true,
      hash: true,
      timings: true,
      assets: true,
      chunks: false,
      chunkModules: false,
      modules: false,
      children: false,
      warnings: true,
    },
    optimization: {
      minimize: true,
      sideEffects: false,
    },
    output: {
      path: ROOT_DIR,
      library: 'ohif-mode-segmentation',
      libraryTarget: 'umd',
      libraryExport: 'default',
      filename: pkg.main,
      // globalObject: "typeof self !== 'undefined' ? self : this",
    },
    externals: [/\b(vtk.js)/, /\b(dcmjs)/, /\b(gl-matrix)/, /^@ohif/, /^@cornerstonejs/],
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
    module: {
      rules: [
        {
          test: /(\.jsx|\.js|\.tsx|\.ts)$/,
          loader: 'babel-loader',
          exclude: /(node_modules|bower_components)/,
          resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
      ],
    }
  });
};