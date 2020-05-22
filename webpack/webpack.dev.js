const Path = require('path');
const HappyPack = require('happypack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');
const config = require('config');
const root = config.get('root');

module.exports = merge(baseWebpackConfig, {
  module: {
    noParse: [/react\..+\.js$/],
    rules: [
      {
        test: /\.css/,
        use: ['happypack/loader?id=postcss'],
        include: [Path.resolve(root, 'src/client')]
      },
      {
        test: /\.css/,
        use: ['happypack/loader?id=postcss1'],
        include: [Path.resolve(root, 'node_modules')],
      },
      {
        test: /\.less/,
        use: ['happypack/loader?id=less'],
        include: [Path.resolve(root, 'node_modules')],
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'postcss',
      loaders: [
        'style-loader',
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
            exclude: /node_modules|antd\.css|picker/,
          }
        },
        'postcss-loader'
      ]
    }),
    new HappyPack({
      id: 'postcss1',
      loaders: [
        'style-loader',
        'postcss-loader'
      ]
    }),
    new HappyPack({
      id: 'less',
      loaders: [
        'style-loader',
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
        }

      ]
    })
  ],
  devServer: {
    host: '0.0.0.0',
    port: config.get('webpack.port'),
    inline: false,
    historyApiFallback: true,
    contentBase: __dirname,
    hot: false,
  }
});
