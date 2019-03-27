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
            handleNotFoundStyleName: 'ignore'
          }
        },
        'postcss-loader'
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
