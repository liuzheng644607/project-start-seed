const Path = require('path');
const HappyPack = require('happypack');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');
const config = require('config');
const root = config.get('root');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = merge(baseWebpackConfig, {
  module: {
    noParse: [/react\..+\.js$/],
    rules: [
      {
        test: /\.css/,
        use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=postcss'],
        include: [Path.resolve(root, 'src/client'), Path.resolve(root, 'node_modules')]
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'postcss',
      loaders: [
        {
          loader: 'typings-for-css-modules-loader',
          options: {
            allowMultiple: true,
            modules: true,
            namedExport: true,
            camelCase: true,
            minimize: true,
            localIdentName: '[local]_[hash:base64:5]',
            handleNotFoundStyleName: 'ignore'
          }
        },
        'postcss-loader'
      ]
    }),
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production 去除 react 代码中的开发时才需要的部分
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),

    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
    }),

    new MiniCssExtractPlugin({
      filename: `[name]_[contenthash:8].css` // 给输出的 CSS 文件名称加上 hash 值
    }),

    // 压缩输出的 JS 代码
    new ParallelUglifyPlugin({
      sourceMap: true,
      uglifyJS: {
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false
        },
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true
        }
      }
    })
  ]
});
