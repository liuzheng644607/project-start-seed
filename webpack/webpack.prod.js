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
        use: [
          MiniCssExtractPlugin.loader, 
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              allowMultiple: true,
              modules: true,
              namedExport: true,
              camelCase: true,
              minimize: true,
              localIdentName: '[local]_[hash:base64:5]',
              handleNotFoundStyleName: 'ignore',
              exclude: /node_modules/,
            }
          },
          'postcss-loader',
        ],
        // include: [Path.resolve(root, 'src/client')]
      },
      {
        test: /\.less/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              modifyVars: {
                'primary-color': '#00adb5',
                'link-color': '#00adb5',
                'border-radius-base': '2px',
              },
              javascriptEnabled: true,
            }
          },
        ]
      }
    ]
  },
  plugins: [
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
  ]
});
